import { Prisma, PrismaClient, vendor } from '@prisma/client';
import { inject, injectable } from 'inversify';
import RepositoryError from '../../error/repositoryError';
import TYPES from '../../dependencyManager/types';
import CommonRepository from '../../common/repositories/commonRepository';
import {
  VendorAddressDetails,
  VendorContactinfo,
  AddVendorBodyData,
  AlignClientsToVendorRequest,
  Address,
  AddVendorResponse,
  AddAddressRequestDto,
  AddContactInfoRequestDto,
  VendorListResponseDTO,
  SortCriteriaDTO,
  SortMappingDTO,
  VendorListDTO,
  VendorMatchListRequestDto,
  VendorMatchListResponseDto,
  VendorMatchDto,
  GetVendorRoomDetailsRequestDto,
} from '../dto/vendor.dto';
import { VENDOR_MESSAGES } from '../../utils/Messages/vendorMessage';
import { repositoryError } from '../../utils/utils';

@injectable()
export default class VendorRepository {
  private readonly prisma: PrismaClient;

  private readonly commonRepository: CommonRepository;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.CommonRepository) commonRepository: CommonRepository,
  ) {
    this.prisma = prisma;
    this.commonRepository = commonRepository;
  }

  async createVendor(data: AddVendorBodyData): Promise<AddVendorResponse> {
    try {
      let statusIds: number[] = [];
      if (data.startDate && data.endDate) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          data.startDate,
          data.endDate,
        );
      }

      const status: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId('Inactive');

      const vendorDetailsResponse: AddVendorResponse =
        await this.prisma.$transaction(async (prisma) => {
          const createdVendorResponse = await prisma.vendor.create({
            data: {
              name: data.name,
              vendorTypeId: data.vendorTypeId,
              isAlsoCaterer: data.isAlsoCaterer,
              startDate: data.startDate,
              endDate: data.endDate ?? null,
              additionalInformation: data.additionalInformation,
              createdBy: data.createdBy,
              updatedBy: data.updatedBy,
              vendorStatusId: status,
              dba: data.dba,
              websiteUrl: data?.websiteUrl,
              facebookUrl: data?.facebookUrl,
              instagramUrl: data?.instagramUrl,
              clientVendors: {
                create: data.clientIds.map((clientId) => ({
                  clientId,
                  createdBy: data.createdBy,
                  updatedBy: data.updatedBy,
                })),
              },
            },
          });
          const allAddresses: Address[] = data.addresses.flatMap(
            (dto: AddAddressRequestDto) => dto.addresses,
          );

          await this.checkPrimaryAddress(
            allAddresses,
            createdVendorResponse.id,
          );

          const addressPromises: Promise<VendorAddressDetails>[] =
            allAddresses.map((address) =>
              prisma.vendorAddressDetails.create({
                data: {
                  vendorId: createdVendorResponse.id,
                  addressTypeId: address.addressTypeId,
                  address1: address.address1,
                  address2: address.address2,
                  cityId: address.cityId,
                  stateId: address.stateId,
                  zipcode: address.zipCode,
                  countryId: address.countryId,
                  phoneNumber: address.phoneNumber,
                  emailAddress: address.emailAddress,
                  isPrimary: address.isPrimary,
                  createdBy: data.createdBy,
                  updatedBy: data.updatedBy,
                },
              }),
            );

          const allContactInfo: VendorContactinfo[] = data.contactInfos.flatMap(
            (dto: AddContactInfoRequestDto) => dto.contactInfos,
          );

          const contactPromises: Promise<VendorContactinfo>[] =
            allContactInfo.map((contactInfo) =>
              prisma.vendorContactDetails.create({
                data: {
                  vendorId: createdVendorResponse.id,
                  contactTypeId: contactInfo.contactTypeId,
                  name: contactInfo.name,
                  phoneNumber: contactInfo.phoneNumber,
                  emailAddress: contactInfo.emailAddress,
                  createdBy: data.createdBy,
                  updatedBy: data.updatedBy,
                },
              }),
            );

          const vendorAddress = await Promise.all(addressPromises);
          const vendorContact = await Promise.all(contactPromises);

          return {
            id: createdVendorResponse.id,
            startDate: createdVendorResponse.startDate,
            endDate: createdVendorResponse.endDate,
            name: createdVendorResponse.name,
            vendorTypeId: createdVendorResponse.vendorTypeId,
            isAlsoCaterer: createdVendorResponse.isAlsoCaterer,
            vendorStatusId: createdVendorResponse.vendorStatusId,
            addresses: vendorAddress,
            contactInfos: vendorContact,
            clientIds: data.clientIds,
            additionalInformation: createdVendorResponse.additionalInformation,
            createdBy: createdVendorResponse.createdBy,
            updatedBy: createdVendorResponse.updatedBy,
            createdAt: createdVendorResponse.createdAt,
            updatedAt: createdVendorResponse.updatedAt,
          };
        });

      return vendorDetailsResponse;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findVendorByName(vendorName: string): Promise<vendor | null> {
    return this.prisma.vendor.findFirst({
      where: {
        name: vendorName,
      },
    });
  }

  async alignClientsToVendor(clientIdsToAlign: AlignClientsToVendorRequest) {
    try {
      const { createdBy } = clientIdsToAlign;
      const { updatedBy } = clientIdsToAlign;
      const { vendorId } = clientIdsToAlign;
      const existingClient = await this.prisma.clientVendors.findMany({
        where: { vendorId },
        select: { clientId: true },
      });

      const existingClientIds: number[] = existingClient.map((c) => c.clientId);

      const clientIdsToAdd: number[] = clientIdsToAlign.clientIds.filter(
        (clientId) => !new Set(existingClientIds).has(clientId),
      );

      const idsToRemove: number[] = existingClientIds.filter(
        (existId) => !new Set(clientIdsToAlign.clientIds).has(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await this.prisma.clientVendors.deleteMany({
          where: { vendorId, clientId: { in: idsToRemove } },
        });
      }

      if (clientIdsToAdd.length) {
        const clientVendor = clientIdsToAdd.map((clientId: number) => ({
          vendorId,
          clientId,
          createdBy,
          createdAt: new Date(),
          updatedBy,
          updatedAt: new Date(),
        }));

        await this.prisma.clientVendors.createMany({
          data: clientVendor,
        });
      }

      return { permission: { id: vendorId } };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async checkPrimaryAddress(
    addresses: Address[],
    vendorId: number,
  ): Promise<void> {
    const newPrimaryAddressesCount = addresses.filter(
      (address) => address.isPrimary,
    ).length;
    const existingPrimaryAddressesCount =
      await this.prisma.vendorAddressDetails.count({
        where: {
          vendorId,
          isPrimary: true,
        },
      });

    if (existingPrimaryAddressesCount + newPrimaryAddressesCount > 1) {
      throw new Error(VENDOR_MESSAGES.EXISTINGDEFAULTADDRESS);
    }
  }

  async findVendorById(id: number): Promise<number> {
    return this.prisma.vendor.count({
      where: {
        id,
      },
    });
  }

  async getVendorById(id: number): Promise<vendor | null> {
    try {
      const vendorData: vendor | null = await this.prisma.vendor.findUnique({
        where: {
          id,
        },
        include: {
          addresses: true,
          contacts: true,
          clientVendors: {
            include: {
              client: true,
            },
          },
          createdByProfile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          updatedByProfile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return vendorData;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  private buildSortCriteria(sortBy: any): {
    field: string;
    order: Prisma.SortOrder;
  } {
    return sortBy
      ? {
          field: sortBy.field,
          order:
            sortBy.order.toLowerCase() === 'asc'
              ? Prisma.SortOrder.asc
              : Prisma.SortOrder.desc,
        }
      : { field: 'id', order: 'asc' };
  }

  private addCondition = (array, condition) => [...(array || []), condition];

  private buildWhereClause({
    searchText,
    filter,
    startDate,
    endDate,
  }: {
    searchText?: string;
    filter?: { name?: string; type?: string; status?: number[] };
    startDate?: Date;
    endDate?: Date;
  }): Prisma.vendorWhereInput {
    const whereClause: Prisma.vendorWhereInput = {};
    if (startDate) {
      whereClause.startDate = { gte: startDate };
    }
    if (endDate) {
      whereClause.endDate = { lte: endDate };
    }
    if (filter?.name) {
      whereClause.AND = this.addCondition(whereClause.AND, {
        name: { contains: filter.name },
      });
    }
    if (filter?.type) {
      whereClause.AND = this.addCondition(whereClause.AND, {
        vendorType: { name: { contains: filter.type } },
      });
    }

    if (Array.isArray(filter?.status) && filter?.status?.length !== 0) {
      whereClause.vendorStatusId = { in: filter?.status };
    }

    if (searchText) {
      const searchDate: Date = new Date(searchText);
      const isValidDate: boolean = !Number.isNaN(searchDate.getTime());
      whereClause.OR = this.addCondition(whereClause.OR, {
        name: { contains: searchText },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        vendorType: { name: { contains: searchText } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        addresses: { some: { address1: { contains: searchText } } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        addresses: { some: { address2: { contains: searchText } } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        addresses: { some: { city: { name: { contains: searchText } } } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        addresses: { some: { state: { name: { contains: searchText } } } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        addresses: { some: { zipcode: { contains: searchText } } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        updatedByProfile: { firstName: { contains: searchText } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        updatedByProfile: { lastName: { contains: searchText } },
      });
      whereClause.OR = this.addCondition(whereClause.OR, {
        vendorStatus: { name: { contains: searchText } },
      });
      if (isValidDate) {
        whereClause.OR = this.addCondition(whereClause.OR, {
          updatedAt: { equals: searchDate },
        });
      }
    }
    return whereClause;
  }

  // Helper method to build sort mapping
  private buildSortMapping(sortCriteria: SortCriteriaDTO): any {
    const sortMapping: SortMappingDTO = {
      type: { vendorType: { name: sortCriteria.order } },
      address1: { addresses: { address1: sortCriteria.order } },
      address2: { addresses: { address2: sortCriteria.order } },
      city: { addresses: { city: { name: sortCriteria.order } } },
      state: { addresses: { state: { name: sortCriteria.order } } },
      updatedByProfile: [
        { updatedByProfile: { firstName: sortCriteria.order } },
        { updatedByProfile: { lastName: sortCriteria.order } },
      ],
    };
    return (
      sortMapping[sortCriteria.field] || {
        [sortCriteria.field]: sortCriteria.order,
      }
    );
  }

  // Helper method to fetch vendor list
  private async fetchVendorList(
    whereClause: Prisma.vendorWhereInput,
    orderBy: any,
    offset: number,
    limit: number,
  ): Promise<VendorListDTO[]> {
    return this.prisma.vendor.findMany({
      where: whereClause,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        isAlsoCaterer: true,
        vendorType: true,
        additionalInformation: true,
        startDate: true,
        endDate: true,
        dba: true,
        websiteUrl: true,
        facebookUrl: true,
        instagramUrl: true,
        addresses: {
          select: {
            id: true,
            vendorId: true,
            addressType: { select: { id: true, name: true, isActive: true } },
            address1: true,
            address2: true,
            city: { select: { id: true, name: true } },
            state: { select: { id: true, name: true } },
            country: { select: { id: true, name: true } },
            zipcode: true,
            emailAddress: true,
            phoneNumber: true,
            isPrimary: true,
            createdAt: true,
            createdBy: true,
            updatedAt: true,
            updatedBy: true,
          },
        },
        vendorStatus: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        createdByProfile: { select: { firstName: true, lastName: true } },
        updatedByProfile: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async getVendorList(vandorListRequestData): Promise<VendorListResponseDTO> {
    try {
      const { searchText, filter, sortBy, offset, limit, startDate, endDate } =
        vandorListRequestData;

      const whereClause: Prisma.vendorWhereInput = this.buildWhereClause({
        searchText,
        filter,
        startDate,
        endDate,
      });

      const sortCriteria: SortCriteriaDTO = this.buildSortCriteria(sortBy);

      const pageSize: number = limit || 20;
      const orderBy = this.buildSortMapping(sortCriteria);

      // Fetch the vendor data with pagination and filtering
      const vendorList = await this.fetchVendorList(
        whereClause,
        orderBy,
        offset,
        limit,
      );

      // Get the total vendor count
      const vendorListCount: number = await this.prisma.vendor.count({
        where: whereClause,
      });

      // Calculate total pages and next page flag
      const totalPages: number = Math.ceil(vendorListCount / pageSize);
      const nextPage: boolean = offset + pageSize < vendorListCount;

      return {
        vendorList,
        totalAmount: vendorListCount,
        totalPages,
        nextPage,
      };
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async viewVendorMatchList(
    data: VendorMatchListRequestDto,
  ): Promise<VendorMatchListResponseDto> {
    try {
      const { offset, limit, filter } = data;

      const vendorList: any[] = await this.prisma.$queryRaw`
      SELECT DISTINCT
      vendor.ID, 
      vendor.Name, 
      address.Address1,
      address.Address2,
      address.ZipCode,
      city.Name AS city, 
      state.Name AS state,
      country.Code AS CountryCode,
      country.Name AS CountryName,
      contact.Name AS contactName,
      contact.PhoneNumber AS contactNumber,
      contacttype.Name AS contactType,
      contact.EmailAddress AS contactEmail,
      (
        (CASE WHEN vendor.Name = ${filter?.name} THEN 1 ELSE 0 END) +     
        (CASE WHEN address.Address1 = ${filter?.addressLine1} THEN 1 ELSE 0 END) +    
        (CASE WHEN city.Name = ${filter?.city} THEN 1 ELSE 0 END) +        
        (CASE WHEN state.Name = ${filter?.state} THEN 1 ELSE 0 END)
      ) / 4.0 * 100 AS match_percentage,
      vendor.CreatedAt,
      vendor.CreatedBy,
      CreatedByProfile.FirstName AS createdByFirstName,
      CreatedByProfile.LastName AS createdByLastName,
      UpdatedByProfile.FirstName AS updatedByFirstName,
      UpdatedByProfile.LastName AS updatedByLastName
      FROM Vendor
      JOIN VendorAddressDetails address ON vendor.ID = address.VendorID
      JOIN City ON address.CityID = city.ID
      JOIN State ON address.StateID = state.ID
      JOIN Country ON country.ID = address.CountryID
      JOIN Profile AS CreatedByProfile ON CreatedByProfile.ID = vendor.CreatedBy
      JOIN Profile AS UpdatedByProfile ON UpdatedByProfile.ID = vendor.UpdatedBy
      LEFT JOIN VendorContactDetails contact ON vendor.ID = contact.VendorID
      JOIN ContactType ON ContactType.ID = contact.ContactTypeID
      ORDER BY match_percentage DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
      `;
      const vendorCount: { total: number }[] = await this.prisma.$queryRaw`
      SELECT COUNT(*) AS total FROM Vendor`;
      const resultingVendorList: VendorMatchDto[] = vendorList.map(
        (vendorItem) => ({
          id: vendorItem.ID,
          name: vendorItem.Name,
          vendorType: vendorItem.VendorType,
          address1: vendorItem.Address1,
          address2: vendorItem.Address2,
          zipCode: vendorItem.ZipCode,
          city: vendorItem.city,
          state: vendorItem.state,
          countryName: vendorItem.CountryName,
          countryCode: vendorItem.CountryCode,
          contactName: vendorItem.contactName,
          contactType: vendorItem.contactType,
          phoneNumber: vendorItem.contactNumber,
          email: vendorItem.contactEmail,
          createdAt: vendorItem.CreatedAt,
          updatedAt: vendorItem.UpdatedAt,
          createdBy: vendorItem.CreatedBy,
          updatedBy: vendorItem.UpdatedBy,
          createdByProfile: {
            firstName: vendorItem.createdByFirstName,
            lastName: vendorItem.createdByLastName,
          },
          updatedByProfile: {
            firstName: vendorItem.updatedByFirstName,
            lastName: vendorItem.updatedByLastName,
          },
          matchPercentage: parseInt(vendorItem.match_percentage, 10),
        }),
      );

      return {
        vendorList: resultingVendorList || [],
        totalAmount: vendorCount[0].total || 0,
      };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }
  async getVendorRoomdetails(data :GetVendorRoomDetailsRequestDto ){
    try {
      const { searchText ,vendorId} = data
      const whereClause: Prisma.vendorRoomWhereInput = {};
      if (searchText) {
        whereClause.OR = [
          { roomName: { contains: searchText } }, 
        ];
      }
      const [vendorRoomdata, totalCount] = await Promise.all([
        this.prisma.vendorRoom.findMany({
          where: {
            vendorId: vendorId,
            ...whereClause,
          },
          select: {
            id: true,
            roomName: true,
            maxCapacity: true,
            rentalFee : true ,
            createdAt: true,
            createdBy: true,
          },
        }),
        this.prisma.vendorRoom.count({
          where: {
            vendorId: vendorId,
            ...whereClause,
          },
        }),
      ]);
      
      return { totalCount, vendorRoomdata };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

}
