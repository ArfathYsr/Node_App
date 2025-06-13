import { client, Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import RepositoryError from '../../error/repositoryError';
import {
  CreateClientDataToDbDto,
  ClientListDataToDbDto,
  UpdateLogo,
  EditClientDataToDbDto,
  ParentClientListDataToDbDto,
  ClientIdDto,
  ClientShortListDataToDbDto,
  ClientDTO,
  GetClientNameReq,
} from '../dto/client.dto';
import { getActiveStatusBasedOnStartDateAndEndDate } from '../../utils/utils';
import { COMMON } from '../../utils/common';

@injectable()
class ClientRepository {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findClientById(clientId: number): Promise<ClientDTO | null> {
    return this.prisma.client.findUnique({ where: { id: clientId } });
  }

  async findClientByIdFullInfo(clientId: number) {
    return this.prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        languageId: true,
        startDate: true,
        endDate: true,
        fieldDate: true,
        createdAt: true,
        updatedAt: true,
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
        clientStatus: {
          select: {
            id: true,
            name: true,
          },
        },
        clientAddress: {
          select: {
            city: true,
            state: true,
            street1: true,
            zipCode: true,
            country: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        parentClient: {
          select: {
            id: true,
            name: true,
          },
        },
        clientTherapeuticArea: {
          select: {
            id: true,
            therapeuticAreaId: true,
            clientId: true,
            therapeuticArea : {
            select: {
              id: true,
              name: true
            }
            }
          },
        },
      },
    });
  }

  async findClientWithAddress(clientId: number) {
    return this.prisma.client.findUnique({
      where: { id: clientId },
      include: { clientAddress: true },
    });
  }

  async findActiveClientsByIds(clientIds: number[]) {
    return this.prisma.client.findMany({
      where: {
        id: { in: clientIds },
        isActive: true,
        clientStatus: {
          name: COMMON.ACTIVE,
        },
      },
    });
  }

  async createClient(clientCreationData: CreateClientDataToDbDto) {
    try {
      const {
        therapeuticAreaId,
        clientAddress,
        ...data
      }: CreateClientDataToDbDto = clientCreationData;
      const newClient: client = await this.prisma.client.create({
        data: {
          ...data,
          isActive: getActiveStatusBasedOnStartDateAndEndDate(
            data.startDate,
            data.endDate,
          ),
          clientAddress: {
            create: clientAddress,
          },
          ...(therapeuticAreaId
            ? {
                clientTherapeuticArea: {
                  create: therapeuticAreaId.map((areaId) => ({
                    therapeuticAreaId: areaId,
                  })),
                },
              }
            : []),
        },
        include: {
          clientAddress: true,
          clientTherapeuticArea: true,
        },
      });

      return newClient;
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async updateClient(clientId: number, updateData: UpdateLogo) {
    try {
      const updatedClient: client = await this.prisma.client.update({
        where: { id: clientId },
        data: updateData,
      });
      return updatedClient;
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
  /* eslint-disable @typescript-eslint/no-shadow */

  async getClientList(clientListDataToDbDto: ClientListDataToDbDto) {
    try {
      const { searchText, filter } = clientListDataToDbDto;
      const isNameArrayEmptyOrOnlyEmptyStrings =
        Array.isArray(filter?.name) &&
        filter?.name.every((item) => item === '');

      const whereClause: Prisma.clientWhereInput = {
        startDate: {
          gte: clientListDataToDbDto.startDate,
          lte: clientListDataToDbDto.endDate,
        },
        AND: [
          !isNameArrayEmptyOrOnlyEmptyStrings && filter?.name?.length
            ? { name: { in: filter.name.map((name) => name.toLowerCase()) } }
            : {},
          filter?.status?.length
            ? { clientStatus: { id: { in: filter.status } } }
            : { clientStatus: { name: COMMON.ACTIVE } },
          filter?.isArchived
            ? { archivedAt: { not: null } }
            : { archivedAt: null },
        ],
      };
      const addressSortByFields: string[] = [
        'city',
        'state',
        'zipCode',
        'country',
      ];
      const sortCriteria: { field: string; order: Prisma.SortOrder } =
        clientListDataToDbDto.sortBy &&
        !addressSortByFields.includes(clientListDataToDbDto.sortBy.field)
          ? {
              field: clientListDataToDbDto.sortBy.field,
              order:
                clientListDataToDbDto.sortBy.order.toLowerCase() === 'asc'
                  ? Prisma.SortOrder.asc
                  : Prisma.SortOrder.desc,
            }
          : {
              field: 'name',
              order: 'asc',
            };
      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
          {
            clientAddress: {
              some: {
                OR: [
                  { city: { contains: searchText } },
                  { state: { contains: searchText } },
                  { street1: { contains: searchText } },
                  { zipCode: { contains: searchText } },
                  {
                    country: {
                      name: { contains: searchText },
                    },
                  },
                ],
              },
            },
          },
        ];
      }
      const clientList = await this.prisma.client.findMany({
        orderBy: [
          {
            [sortCriteria.field]: sortCriteria.order,
          },
        ],
        where: whereClause,
        skip: clientListDataToDbDto.offset,
        take: clientListDataToDbDto.limit,
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          startDate: true,
          endDate: true,
          fieldDate: true,
          logo: true,
          archivedAt: true,
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
          clientStatus: {
            select: {
              id: true,
              name: true,
            },
          },
          clientAddress: {
            select: {
              country: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              city: true,
              state: true,
              street1: true,
              zipCode: true,
            },
          },
          clientTherapeuticArea: {
            select: {
              id: true,
              clientId: true,
              therapeuticAreaId: true,
            },
          },
        },
      });

      const clientFilters = await Promise.all([
        this.prisma.client.findMany({
          distinct: ['name'],
          select: { name: true },
          where: { name: { not: '' } },
          orderBy: { name: 'asc' },
        }),
        this.prisma.clientStatus.findMany({
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        }),
      ]);
      const [clientNames, clientStatuses] = clientFilters;

      const clientCount: number = await this.prisma.client.count({
        where: whereClause,
      });
      return {
        clients: clientList,
        totalAmount: clientCount,
        filters: {
          clientNames: clientNames?.map((client) => client.name),
          clientStatuses,
          isArchived: filter?.isArchived ? filter.isArchived : false,
        },
      };
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getShortClientList(
    clientDropdownListDataToDbDto: ClientShortListDataToDbDto,
  ) {
    try {
      const { searchText, filter } = clientDropdownListDataToDbDto;
      const whereClause: Prisma.clientWhereInput = {
        clientStatus: { name: 'Active' },
      };
      if (searchText) {
        whereClause.OR = [{ name: { contains: searchText } }];
      }
      if (filter?.status?.length) {
        whereClause.clientStatus = { name: { in: filter.status } };
      }
      const clientList = await this.prisma.client.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
        },
      });
      return clientList;
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async clientStatusList() {
    return this.prisma.clientStatus.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async editClient(clientId: number, clientEditData: EditClientDataToDbDto) {
    const {
      clientAddress,
      therapeuticAreaId,
      updatedBy,
      ...client
    }: EditClientDataToDbDto = clientEditData;
    try {
      const editClient: client = await this.prisma.client.update({
        where: { id: clientId },
        data: {
          ...client,
          updatedBy,
          isActive: getActiveStatusBasedOnStartDateAndEndDate(
            client.startDate,
            client.endDate,
          ),
          clientAddress: clientAddress
            ? {
                updateMany: {
                  where: { clientId },
                  data: {
                    ...clientAddress[0],
                    updatedBy,
                  },
                },
              }
            : undefined,
          ...(therapeuticAreaId
            ? {
                clientTherapeuticArea: {
                  deleteMany: {
                    clientId,
                  },
                  create: therapeuticAreaId.map((areaId) => ({
                    therapeuticAreaId: areaId,
                  })),
                },
              }
            : []),
        },
        include: {
          clientAddress: true,
          clientTherapeuticArea: true,
        },
      });
      return editClient;
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getParentClientList(
    parentClientListDataToDbDto: ParentClientListDataToDbDto,
  ) {
    try {
      const { searchText }: { searchText?: string } =
        parentClientListDataToDbDto;
      const whereClause: Prisma.clientWhereInput = {
        parentClient: null,
      };
      const sortCriteria: { field: string; order: Prisma.SortOrder } = {
        field: 'name',
        order: 'asc',
      };
      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }

      const ParentClientList = await this.prisma.client.findMany({
        orderBy: [
          {
            [sortCriteria.field]: sortCriteria.order,
          },
        ],
        where: whereClause,
        skip: parentClientListDataToDbDto.offset,
        take: parentClientListDataToDbDto.limit,
        select: {
          id: true,
          name: true,
        },
      });
      return {
        parentClients: ParentClientList,
      };
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findClientsByNames(names: string | string[], parentClientId?: number) {
    try {
      const nameArray: string[] = Array.isArray(names) ? names : [names];
      const clientRecords: client[] = await this.prisma.client.findMany({
        where: {
          name: {
            in: nameArray,
          },
          parentClientId: parentClientId ?? null,
        },
      });
      return clientRecords;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getExistingClientIds(clientIds: number[]) {
    try {
      const existingClientids: ClientIdDto[] =
        await this.prisma.client.findMany({
          where: { id: { in: clientIds } },
          select: { id: true },
        });
      return existingClientids;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async deleteClients(clientIds: number[]) {
    try {
      return await this.prisma.client.deleteMany({
        where: {
          id: {
            in: clientIds,
          },
        },
      });
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getClientName(data: GetClientNameReq) {
      return this.prisma.client.findMany({
        where: {
          id: {
            in: data.clientIds
          }
        },
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          clientStatus: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });
    }
}
export default ClientRepository;
