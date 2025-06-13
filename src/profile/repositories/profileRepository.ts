import {
  Prisma,
  PrismaClient,
  profile as Profile,
  profilePhoneInfo,
  profileStatus,
} from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';
import TYPES from '../../dependencyManager/types';
import RepositoryError from '../../error/repositoryError';
import {
  CreateChildProfileDto,
  CreateProfileToDbDto,
  GetProfileListRequestDto,
  UpdateProfileToDbDto,
  DelegateManagerListDataToDbDto,
  UpdateMyProfileBodyDto,
  UpdatedProfile,
  EditBulkProfileBodyDto,
  EditBuilkProfileResponseDto,
  FormattedProfileData,
  ProfileTheme,
  ProfileResponseDto,
  ImportUserProfileDto,
  ProfileClient,
  UserInfoResponseDto,
  LocaleDto,
  ListBrandColorResponse,
  ListThemeResponse,
  DefaultEmailType,
  ProfileDto,
  InterfaceThemeDTO,
  BrandColorDTO,
  GetProfilesListResponseDto,
  CreateHcpProfileToDbDto,
  CreateHcpProfileReturnType,
  EditProfileRolePermissionAlignmentDto,
  CreateProfileRolePermissionAlignmentDto,
  EditHcpProfileDto,
  AddAddressAndEmailRequestDto,
  ProfileEmail,
  ProfileEmailAddress,
  ProfileAddressDetails,
  ProfileDetailsResponseDto,
  CreateHcpBioProfessionRequestDTO,
  CreateHcpBioProfessionResponseDTO,
  ProfileSegmentationResponseDto,
  HcpBioProfessionDTO,
  UpdateHcpCredentialsRequestDto,
  CommunicationPreferencesRequestDto,
  CommunicationPreferencesResponseDto,
  GetProfileNameReq,
} from '../dto/profile.dto';
import { S3Service } from '../../libs/s3Service';
import { COMMON } from '../../utils/common';
import { PROFILE_MESSAGES } from '../../utils/Messages/profileMessage';
import { ERRORMESSAGE } from '../../utils/errorMessage';
import CommonRepository from '../../common/repositories/commonRepository';
import { repositoryError } from '../../utils/utils';

@injectable()
class ProfileRepository {
  private readonly prisma: PrismaClient;

  private readonly s3Service: S3Service;

  private readonly commonRepository: CommonRepository;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.S3Service) s3Service: S3Service,
    @inject(TYPES.CommonRepository) commonRepository: CommonRepository,
  ) {
    this.s3Service = s3Service;
    this.prisma = prisma;
    this.commonRepository = commonRepository;
  }

  async findProfileById(id: number): Promise<ProfileDto | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }
  async findValidCloneId(id: number) {
    try {
      const cloneIdData: { id: number } | null =
        await this.prisma.profile.findUnique({
          where: { id },
          select: {
            id: true,
          },
        });

      return cloneIdData;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findProfileByIdentityId(
    identityId: string,
  ): Promise<ProfileDto | null> {
    return this.prisma.profile.findUnique({ where: { identityId } });
  }

  async findProfileByEmail(email: string) {
    return this.prisma.profile.findFirst({
      select: { email: true },
      where: { email: { some: { emailAddress: email } } },
    });
  }

  async findthemebyId(clientId: number): Promise<InterfaceThemeDTO | null> {
    return this.prisma.interfacetheme.findUnique({ where: { id: clientId } });
  }

  async findbrancolorcodeId(colorcodeId: number ): Promise<BrandColorDTO | null> {
    return this.prisma.brandColor.findUnique({
      where: { id: colorcodeId },
    });
  }

  async getDefaultEmailType(): Promise<DefaultEmailType> {
    return this.prisma.emailAddressType.findFirst({
      select: { id: true },
      where: { name: 'default' },
    });
  }

  async createProfile({
    emailTypeId,
    email,
    roleIds,
    interfaceThemeId,
    brandColorCodeId,
    clientIds,
    ...profileCreationData
  }: CreateProfileToDbDto) {
    try {
      let statusIds: number[] = [];
      if (profileCreationData.startDate && profileCreationData.endDate) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          profileCreationData.startDate,
          profileCreationData.endDate,
        );
      }
      const status: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE);
      const newProfile = await this.prisma.profile.create({
        data: {
          ...profileCreationData,
          endDate: profileCreationData.endDate ?? null,
          updatedBy: profileCreationData.createdBy,
          profileStatusId: status,
          email: {
            create: {
              emailAddress: email,
              emailAddressTypeId: emailTypeId,
              createdBy: profileCreationData.createdBy,
              updatedBy: profileCreationData.createdBy,
              isActive: true,
              correspondance: false,
            },
          },
          profileRole: {
            create: roleIds.map((groupId) => ({
              role: {
                connect: { id: groupId },
              },
            })),
          },
          ...(interfaceThemeId
            ? {
                profileThemes: {
                  create: {
                    interfaceThemeId,
                    brandColorCodeId,
                    createdBy: profileCreationData.createdBy,
                    updatedBy: profileCreationData.createdBy,
                  },
                },
              }
            : {}),
          ...(brandColorCodeId
            ? {
                profileThemes: {
                  create: {
                    interfaceThemeId,
                    brandColorCodeId,
                    createdBy: profileCreationData.createdBy,
                    updatedBy: profileCreationData.createdBy,
                  },
                },
              }
            : {}),
          profileClient: {
            create: clientIds?.map((clientId) => ({
              clientId,
              startDate: profileCreationData.startDate ?? null,
              endDate: profileCreationData.endDate ?? null,
              createdBy: profileCreationData.createdBy,
              updatedBy: profileCreationData.createdBy,
            })),
          },
        },
        include: {
          email: true,
          profileThemes: true,
          phone: true,
          profileRole: {
            include: {
              role: true,
            },
          },
          profileFunctionalArea: {
            include: {
              functionalArea: true,
            },
          },
          profileClient: true,
        },
      });
      const formattedResponse: ProfileResponseDto = {
        profile: {
          id: newProfile.id,
          createdAt: newProfile.createdAt,
          createdBy: newProfile.createdBy,
          updatedAt: newProfile.updatedAt,
          updatedBy: newProfile.updatedBy,
          profileStatusId: newProfile.profileStatusId,
          firstName: newProfile.firstName,
          lastName: newProfile.lastName,
          middleName: newProfile.middleName,
          preferredName: newProfile.preferredName,
          title: newProfile.title,
          sapIntegration: newProfile.sapIntegration,
          isExternal: newProfile.isExternal,
          internalMasterId: newProfile.internalMasterId,
          externalMasterId: newProfile.externalMasterId,
          sapVendorId: newProfile.sapVendorId,
          federationId: newProfile.federationId,
          clientId: newProfile.clientId,
          managerId: newProfile.managerId,
          delegateId: newProfile.delegateId,
          identityId: newProfile.identityId,
          startDate: newProfile.startDate,
          endDate: newProfile.endDate,
        },
        email: newProfile.email.map((em) => ({
          id: em.id,
          createdAt: em.createdAt,
          createdBy: em.createdBy,
          updatedAt: em.updatedAt,
          updatedBy: em.updatedBy,
          isActive: em.isActive,
          profileId: em.profileId,
          emailAddress: em.emailAddress,
          emailAddressTypeId: em.emailAddressTypeId,
          correspondance: em.correspondance,
        })),
        phone: newProfile.phone.map((phone) => ({
          id: phone.id,
          createdAt: phone.createdAt,
          createdBy: phone.createdBy,
          updatedAt: phone.updatedAt,
          updatedBy: phone.updatedBy,
          isActive: phone.isActive,
          profileId: phone.profileId,
          countryCode: phone.countryCode,
          phoneNumber: phone.phoneNumber,
          phoneTypeId: phone.phoneTypeId,
          correspondance: phone.correspondance,
        })),
        role: newProfile.profileRole.map((profileRole) => ({
          id: profileRole.role.id,
          statusId: profileRole.role.statusId,
          name: profileRole.role.name,
          description: profileRole.role.description,
          isExternal: profileRole.role.isExternal,
        })),
        theme:
          newProfile.profileThemes.map((theme) => ({
            id: theme.id,
            profileId: theme.profileId,
            interfaceThemeId: theme.interfaceThemeId,
            brandColorCodeId: theme.brandColorCodeId,
            createdBy: theme.createdBy,
            updatedBy: theme.updatedBy,
          }))[0] || null,
        clients: newProfile.profileClient.map((client) => ({
          id: client.id,
          profileId: client.profileId,
          clientId: client.clientId,
          startDate: client.startDate,
          endDate: client.endDate,
          createdAt: client.createdAt,
          createdBy: client.createdBy,
          updatedAt: client.updatedAt,
          updatedBy: client.updatedBy,
        })),
      };

      return formattedResponse;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getProfileList(
    profileListData: GetProfileListRequestDto,
    [startOfTodayDate, endOfTodayDate]: [DateTime, DateTime],
  ): Promise<GetProfilesListResponseDto> {
    try {
      const { searchText, filter, sortBy, offset, limit } = profileListData;
      const searchCondition: string = searchText
        ? `(Profile.FirstName LIKE '%' + '${searchText}'
          OR Profile.ID LIKE '%' + '${searchText}'
          OR pad.Address LIKE '%' + '${searchText}'
          OR c.Name LIKE '%' + '${searchText}'
          OR s.Name LIKE '%' + '${searchText}'
          OR ProfileStatus.StatusName LIKE '%' + '${searchText}'
          OR Profile.LastName LIKE '%' + '${searchText}'
          OR Profile.MiddleName LIKE '%' + '${searchText}'
          OR Profile.FullName LIKE '%' + '${searchText}'
          OR Profile.Title LIKE '%' + '${searchText}'
          OR (Profile.FirstName + ' ' + Profile.LastName) LIKE '%' + '${searchText}' + '%'
          OR FunctionalArea.Name LIKE '%${searchText}%'
          OR Role.Name LIKE '%${searchText}%'
          OR DefaultEmail.emailAddress LIKE '%${searchText}%'
          OR DefaultPhone.phoneNumber LIKE '%' + '${searchText}' + '%')`
        : ``;
      const conditions: string[] = [searchCondition];
      if (filter) {
        const filterRoles = await this.getFilterRoles(filter.roles);

        const filterFunctionalAreas: string = filter?.functionalAreas?.length
          ? `Role.FunctionalAreaId IN (${filter.functionalAreas})`
          : ``;

        const filterStatus: string =
          filter.statusId !== undefined
            ? `Profile.profileStatusId = '${filter.statusId}'`
            : ``;
        const filterStartDate: string = filter.startDate
          ? `Profile.startDate >= '${filter.startDate}' AND Profile.startDate <= '${filter.endDate}'`
          : ``;
        
        let filterIsArchived: string = ``;
        if (filter.isArchived !== undefined) {
          if (filter.isArchived === 2) {
            filterIsArchived = 'Profile.ArchivedAt IS NOT NULL'
          }
          if (filter.isArchived === 0) {
            filterIsArchived =  'Profile.ArchivedAt IS NULL';
          }
        } else {
          filterIsArchived =  'Profile.ArchivedAt IS NULL';
        }
        // Add filter for state and city
        const filterState: string = filter?.stateId
          ? `pad.stateId = '${filter.stateId}'`
          : ``;
        const filterCity: string = filter?.cityId
          ? `pad.cityId = '${filter.cityId}'`
          : ``;
        const filterExternal: string =
          filter.isExternal !== undefined
            ? `Profile.IsExternal = '${filter.isExternal}'`
            : ``;

        conditions.push(
          filterRoles,
          filterFunctionalAreas,
          filterStatus,
          filterIsArchived,
          filterStartDate,
          filterState,
          filterCity,
          filterExternal,
        );
      }
      let orderCondition: string = '';
      const sortOrder: string =
        profileListData.sortBy.order.toLowerCase() !== 'asc'
          ? Prisma.SortOrder.desc
          : Prisma.SortOrder.asc;

      const sortFieldMap: { [key: string]: string } = {
        id: 'Profile.id',
        firstName: 'Profile.firstName',
        role: 'Role.Name',
        functionalArea: 'FunctionalArea.Name',
        address: 'pad.Address',
        state: 's.Name',
        city: 'c.Name',
        permissionGroups: 'permissionGroupsCount',
        permissionCount: 'permissionCount',
        updatedBy: 'UpdatedByProfile.FirstName',
        createdBy: 'CreatedByProfile.FirstName',
        defaultEmail: 'DefaultEmail.emailAddress',
        defaultPhone: 'DefaultPhone.phoneNumber',
        profileStatusId: 'Profile.profileStatusId',
        updatedByProfile:
          'UpdatedByProfile.FirstName, UpdatedByProfile.LastName',
      };

      const orderField =
        sortFieldMap[sortBy.field] || `Profile.${sortBy.field}`;
      orderCondition = `${orderField} ${sortOrder}`;
      const joinDefaultWhereCondition = `
        LEFT JOIN Phone AS DefaultPhone ON DefaultPhone.ProfileId = Profile.ID
          AND EXISTS (SELECT 1 FROM PhoneType WHERE PhoneType.ID = DefaultPhone.PhoneTypeId AND PhoneType.Name = 'default')
        INNER JOIN Email AS DefaultEmail ON DefaultEmail.ProfileId = Profile.ID
          AND EXISTS (SELECT 1 FROM EmailAddressType WHERE EmailAddressType.ID = DefaultEmail.EmailAddressTypeId AND EmailAddressType.Name = 'default')
        LEFT JOIN  ProfileRole ON ProfileRole.ProfileID = Profile.ID
        LEFT JOIN Role ON Role.ID = ProfileRole.RoleID LEFT JOIN  FunctionalArea ON Role.FunctionalAreaID = FunctionalArea.Id
        LEFT JOIN ProfileTheme ON ProfileTheme.profileId = Profile.id
        LEFT JOIN Interfacetheme ON Interfacetheme.interfaceThemeId = ProfileTheme.interfaceThemeId
        LEFT JOIN BrandColor ON BrandColor.Id = ProfileTheme.brandColorCodeId
        LEFT JOIN ProfileStatus ON ProfileStatus.ID = Profile.ProfileStatusId 
        OUTER APPLY (
          SELECT TOP 1 *
          FROM ProfileAddressDetails pad
          WHERE pad.profileId = Profile.id
          ORDER BY pad.id
        ) pad
        LEFT JOIN state s ON pad.stateId = s.id
        LEFT JOIN city c ON pad.cityId = c.id
`;
      let whereCondition: string = '';
      conditions.filter(Boolean).forEach((condition, index) => {
        if (condition) {
          if (index === 0) {
            whereCondition += `WHERE ${condition}`;
          } else {
            whereCondition += ` AND ${condition}`;
          }
        }
      });

      const profilesList: any[] = await this.prisma.$queryRaw`
      SELECT
        Profile.id,
        Profile.createdAt,
        Profile.updatedAt,
        Profile.createdBy,
        Profile.updatedBy,
        Profile.profileStatusId,
        Profile.firstName,
        Profile.lastName,
        Profile.middleName,
        Profile.preferredName,
        Profile.title,
        Profile.sapIntegration,
        Profile.isExternal,
        Profile.internalMasterId,
        Profile.externalMasterId,
        Profile.sapVendorId,
        Profile.clientId,
        Profile.managerId,
        Profile.delegateId,
        Profile.identityId,
        Profile.startDate,
        Profile.endDate,
        Profile.photo,
        ProfileStatus.statusName as profileStatusName,
        Role.id as roleId,
        Role.functionalAreaId as roleFunctionalAreaId,
        FunctionalArea.name as functionalAreaName,
        COALESCE(ProfileTheme.id, NULL) AS profileThemeId, 
  COALESCE(ProfileTheme.brandColorCodeId, NULL) AS brandColorCodeId,
  COALESCE(Interfacetheme.interfaceThemeId, NULL) AS interfaceThemeId, 
  COALESCE(Interfacetheme.themeName, NULL) AS themeName,
  COALESCE(Interfacetheme.themeImageUrl, NULL) AS themeImageUrl,
        CASE
            WHEN Role.StartDate IS NULL AND Role.EndDate IS NOT NULL AND ${startOfTodayDate} <= Role.EndDate
                THEN CAST(1 AS BIT)
            WHEN Role.StartDate IS NOT NULL AND Role.EndDate IS NOT NULL AND Role.StartDate <= ${startOfTodayDate} AND
                Role.EndDate >= ${endOfTodayDate} THEN CAST(1 AS BIT)
            ELSE CAST(0 AS BIT)
        END AS roleIsActive,
        Role.name as roleName,
        Role.description as roleDescription,
        Role.isExternal as roleIsExternal,
        DefaultEmail.id as emailId,
        DefaultEmail.isActive as emailIsActive,
        DefaultEmail.emailAddress as emailAddress,
        DefaultEmail.emailAddressTypeId as emailAddressTypeId,
        DefaultEmail.correspondance as emailCorrespondance,
        DefaultPhone.id as phoneId,
        DefaultPhone.isActive as phoneIsActive,
        DefaultPhone.countryCode as countryCode,
        DefaultPhone.phoneTypeId as phoneTypeId,
        DefaultPhone.phoneNumber as phoneNumber,
        DefaultPhone.correspondance as phoneCorrespondance,
        CreatedByProfile.FirstName as createByFirstName,
        CreatedByProfile.LastName as createByLastName,
        UpdatedByProfile.FirstName as updatedByFirstName,
        UpdatedByProfile.LastName as updatedByLastName,
        Profile.archivedAt,
        (SELECT DISTINCT COUNT(1) FROM  RolePermissionGroup WHERE RoleID = Role.id ) as permissionGroupsCount,
        (SELECT DISTINCT COUNT(1) FROM  RolePermission WHERE RoleID = Role.id ) as permissionCount,
        pad.stateId,
        s.name AS stateName,
        pad.cityId,
        c.name AS cityName,
        pad.zipCode,
        pad.Address as addressName
      FROM Profile
      JOIN Profile AS CreatedByProfile ON CreatedByProfile.ID = Profile.CreatedBy
      JOIN Profile AS UpdatedByProfile ON UpdatedByProfile.ID = Profile.UpdatedBy
      ${Prisma.raw(joinDefaultWhereCondition)}
      ${Prisma.raw(whereCondition)}
      GROUP BY
        Role.FunctionalAreaID,
        FunctionalArea.Name,
        Role.Id,
        Role.Name,
        Role.Description,
        Role.IsExternal,
        Role.StartDate,
        Role.EndDate,
        Profile.ID,
        Profile.CreatedAt,
        Profile.UpdatedAt,
        Profile.CreatedBy,
        Profile.UpdatedBy,
        Profile.ProfileStatusId,
        Profile.FirstName,
        Profile.LastName,
        Profile.MiddleName,
        Profile.PreferredName,
        Profile.Title,
        Profile.SapIntegration,
        Profile.IsExternal,
        Profile.InternalMasterId,
        Profile.ExternalMasterId,
        Profile.SapVendorId,
        Profile.ClientId,
        Profile.ManagerId,
        Profile.DelegateId,
        Profile.IdentityId,
        Profile.StartDate,
        Profile.EndDate,
        Profile.Photo,
        DefaultEmail.ID,
        DefaultEmail.IsActive,
        DefaultEmail.EmailAddress,
        DefaultEmail.EmailAddressTypeId,
        DefaultEmail.Correspondance,
        DefaultPhone.ID,
        DefaultPhone.IsActive,
        DefaultPhone.CountryCode,
        DefaultPhone.PhoneTypeId,
        DefaultPhone.PhoneNumber,
        DefaultPhone.Correspondance,
        CreatedByProfile.FirstName,
        CreatedByProfile.LastName,
        UpdatedByProfile.FirstName,
        UpdatedByProfile.LastName,
        Profile.ArchivedAt,
        ProfileTheme.id,
        ProfileTheme.brandColorCodeId,
        InterfaceTheme.interfaceThemeId,
        InterfaceTheme.themeName,
        InterfaceTheme.themeImageUrl,
        ProfileStatus.statusName,
        pad.stateId,
        s.name,
        pad.cityId,
        c.name,
        pad.zipCode,
        pad.Address
      ORDER BY ${Prisma.raw(orderCondition)}
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
  `;
      const profilesCount: { total: number }[] = await this.prisma.$queryRaw`
  SELECT COUNT(*) AS total
  FROM Profile
  ${Prisma.raw(joinDefaultWhereCondition)}
  ${Prisma.raw(whereCondition)}
`;
      const resultingProfilesList = profilesList.map((profile) => ({
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        middleName: profile.middleName || null,
        preferredName: profile.preferredName || null,
        title: profile.title || null,
        profileStatusId: profile.profileStatusId,
        profileStatusName: profile.profileStatusName,
        isExternal: profile.isExternal,
        clientId: profile.clientId || null,
        internalMasterId: profile.internalMasterId || null,
        externalMasterId: profile.externalMasterId || null,
        managerId: profile.managerId || null,
        delegateId: profile.delegateId || null,
        sapVendorId: profile.sapVendorId || null,
        sapIntegration: profile.sapIntegration,
        identityId: profile.identityId || null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        startDate: profile.startDate || null,
        endDate: profile.endDate || null,
        photo: profile.photo,
        createdBy: profile.createdBy,
        updatedBy: profile.updatedBy,
        archivedAt: profile.archivedAt || null,
        permissionGroupsCount: profile.permissionGroupsCount || 0,
        permissionCount: profile.permissionCount ?? 0,
        address: {
          address: profile.addressName,
          state: profile.stateName,
          city: profile.cityName,
          zipCode: profile.zipCode || null,
        },
        createdByProfile: {
          firstName: profile.createByFirstName,
          lastName: profile.createByLastName,
        },
        updatedByProfile: {
          firstName: profile.updatedByFirstName,
          lastName: profile.updatedByLastName,
        },
        email: [{
          id: profile.emailId,
          isActive: profile.emailIsActive,
          emailAddress: profile.emailAddress,
          emailAddressTypeId: profile.emailAddressTypeId,
          correspondance: profile.emailCorrespondance,
        }],
        phone: {
          id: profile.phoneId,
          isActive: profile.phoneIsActive,
          countryCode: profile.countryCode,
          phoneNumber: profile.phoneNumber,
          phoneTypeId: profile.phoneTypeId,
          correspondance: profile.phoneCorrespondance,
        },
        role: {
          id: profile.roleId,
          status: profile.roleIsActive,
          name: profile.roleName,
          description: profile.roleDescription,
          isExternal: profile.roleIsExternal,
          functionalAreaId: profile.roleFunctionalAreaId,
        },
        functionalAreaName: profile.functionalAreaName,
        profileThemes: profile.profileThemeId
          ? {
              id: profile.profileThemeId,
              brandColorCodeId: profile.brandColorCodeId,
              interfaceTheme: {
                id: profile.interfaceThemeId,
                themeName: profile.themeName,
                themeImageUrl: profile.themeImageUrl,
              },
            }
          : null,
      }));

      return {
        profiles: resultingProfilesList || [],
        totalAmount: profilesCount[0].total || 0,
      };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findProfileByIdWithEmailAndDefaultEmailType(id: number) {
    return this.prisma.profile.findUnique({
      where: { id },
      include: {
        email: {
          include: {
            emailAddressType: true,
          },
          where: {
            emailAddressType: {
              name: 'default',
            },
          },
        },
      },
    });
  }

  async findProfilephoneNumber(id: number) {
    return this.prisma.profile.findUnique({
      where: { id },
      include: {
        phone: {
          include: {
            phoneType: true,
          },
        },
      },
    });
  }

  async updateProfile({
    id,
    email,
    emailId,
    roleIds,
    interfaceThemeId,
    brandColorCodeId,
    clientIds,
    ...profileCreationData
  }: UpdateProfileToDbDto) {
    try {
      const existingRoleIds: number[] = await this.prisma.profileRole
        .findMany({
          where: { profileId: id },
          select: { roleId: true },
        })
        .then((result) => result.map((pg) => pg.roleId));

      const idsToAdd: number[] = roleIds.filter(
        (roleId) => !existingRoleIds.includes(roleId),
      );
      const idsToRemove: number[] = existingRoleIds.filter(
        (existId) => !roleIds.includes(existId),
      );

      if (idsToRemove.length) {
        await this.prisma.profileRole.deleteMany({
          where: {
            profileId: id,
            roleId: { in: idsToRemove },
          },
        });
      }

      if (idsToAdd.length) {
        await this.prisma.profileRole.createMany({
          data: idsToAdd.map((roleId) => ({
            profileId: id,
            roleId,
          })),
        });
      }
      let statusIds: number[] = [];
      if (profileCreationData.startDate && profileCreationData.endDate) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          profileCreationData.startDate,
          profileCreationData.endDate,
        );
      }
      const status: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE);

      const updatedProfile = await this.prisma.profile.update({
        where: { id },
        data: {
          ...profileCreationData,
          endDate: profileCreationData.startDate
            ? profileCreationData.endDate
            : null,
          updatedBy: profileCreationData.updatedBy,
          profileStatusId: status,
          email: {
            update: {
              where: { id: emailId },
              data: { emailAddress: email },
            },
          },
        },
        include: {
          email: true,
          phone: true,
          profileRole: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  isExternal: true,
                  startDate: true,
                  endDate: true,
                  statusId: true,
                },
              },
            },
          },
          profileStatus: {
            select: { id: true, statusName: true },
          },
        },
      });
      let profileTheme: ProfileTheme | null = null;
      if (interfaceThemeId || brandColorCodeId) {
        const existingProfileTheme: ProfileTheme | null =
          await this.prisma.profileTheme.findFirst({
            where: { profileId: id },
          });

        if (existingProfileTheme) {
          profileTheme = await this.prisma.profileTheme.update({
            where: { id: existingProfileTheme.id },
            data: {
              interfaceThemeId,
              brandColorCodeId,
              updatedBy: profileCreationData.updatedBy,
            },
          });
        } else {
          profileTheme = await this.prisma.profileTheme.create({
            data: {
              profileId: id,
              interfaceThemeId,
              brandColorCodeId,
              createdBy: profileCreationData.updatedBy,
              updatedBy: profileCreationData.updatedBy,
            },
          });
        }
      }
      let profileClients: ProfileClient[] = [];
      if (clientIds && clientIds.length > 0) {
        await this.prisma.profileClient.deleteMany({
          where: { profileId: id },
        });

        profileClients = await Promise.all(
          clientIds.map(async (clientId) => {
            const createdClient: ProfileClient =
              await this.prisma.profileClient.create({
                data: {
                  profileId: id,
                  clientId,
                  startDate: profileCreationData.startDate ?? null,
                  endDate: profileCreationData.endDate ?? null,
                  createdBy: profileCreationData.updatedBy,
                  updatedBy: profileCreationData.updatedBy,
                },
              });
            return createdClient;
          }),
        );
      }

      return {
        ...updatedProfile,
        profileTheme,
        profileClients,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async findProfileByIdentityIdUserId(loginId: string, userid: string) {
    return this.prisma.profile.findFirst({
      where: {
        OR: [{ identityId: loginId }, { identityId: userid }],
      },
      include:{
        timeZone:{
          select: {
            name: true,
            abbreviation: true,
            utcOffset: true,
          }
        }
      }
    });
  }

  async findProfileByIdIncludeEmailAndRole(id: number) {
    const profileData = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        client: true,
        manager: {
          select: {
            title: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: {
              where: {
                emailAddressType: {
                  name: 'default',
                },
              },
              select: {
                emailAddress: true,
              },
            },
          },
        },
        delegate: {
          select: {
            title: true,
            firstName: true,
            middleName: true,
            lastName: true,
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
        email: {
          where: {
            emailAddressType: {
              name: 'default',
            },
          },
        },
        phone: {
          where: {
            phoneType: {
              name: 'default',
            },
          },
        },
        profileRole: {
          include: {
            role: {
              include: {
                rolePermissionGroup: {
                  include: {
                    permissionGroup: true,
                  },
                },
                functionalArea: true,
              },
            },
          },
        },
        profileClient: {
          select: {
            id: true,
            profileId: true,
            clientId: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
            updatedBy: true,
          },
        },
        profileThemes: {
          include: {
            interfaceTheme: true,
          },
        },
        profileStatus: {
          select: {
            id: true,
            statusName: true,
          },
        },
      },
    });

    return profileData
      ? {
          ...profileData,
          email: profileData?.email[0],
          phone: profileData?.phone.length ? profileData.phone[0] : null,
          manager: profileData.manager
            ? {
                ...profileData.manager,
                email: profileData.manager.email[0]?.emailAddress || null,
              }
            : null,
          permissionGroups: profileData.profileRole.flatMap((profileRole) =>
            profileRole.role.rolePermissionGroup.map(
              (rolePermissionGroup) => rolePermissionGroup.permissionGroup,
            ),
          ),
          profileThemes: profileData.profileThemes.length
            ? {
                id: profileData.profileThemes[0].id,
                brandColorCode: profileData.profileThemes[0]?.brandColorCodeId,
                interfaceTheme: {
                  id: profileData.profileThemes[0].interfaceTheme?.id,
                  themeName:
                    profileData.profileThemes[0].interfaceTheme?.themeName,
                  themeImageUrl:
                    profileData.profileThemes[0].interfaceTheme?.themeImageUrl,
                },
              }
            : null,
          functionalAreas: profileData.profileRole.flatMap(
            (profileRole) => profileRole.role.functionalArea,
          ),
          profileRole: undefined,
        }
      : null;
  }

  async findProfileByIdToGetAllData(id: number) {
    const profileDetails = await this.prisma.profile.findUnique({
      where: { id },
      include: {
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
        email: {
          where: {
            emailAddressType: {
              name: 'default',
            },
          },
        },
        phone: {
          where: {
            phoneType: {
              name: 'default',
            },
          },
        },
        profileStatus: {
          select: {
            id: true,
            statusName: true,
          },
        },
        profileRole: {
          include: {
            role: {
              include: {
                rolePermissionGroup: {
                  include: {
                    permissionGroup: true,
                  },
                },
                functionalArea: true,
              },
            },
          },
        },
      },
    });
    return profileDetails;
  }

  async getDelegateManagerList(
    profileListData: DelegateManagerListDataToDbDto,
  ) {
    try {
      const { searchText, offset, limit } = profileListData;

      const DelegateManagerprofileIds = await this.prisma.profile
        .findMany({
          where: {
            OR: [{ managerId: { not: null } }, { delegateId: { not: null } }],
          },
          select: {
            managerId: true,
            delegateId: true,
          },
        })
        .then((result) =>
          result
            .flatMap((dm) => [dm.managerId, dm.delegateId])
            .filter((id): id is number => id !== null),
        );

      const whereClause: Prisma.profileWhereInput = {
        id: { in: DelegateManagerprofileIds },
      };

      const sortCriteria: { field: string; order: Prisma.SortOrder } = {
        field: 'id',
        order: 'asc',
      };

      if (searchText) {
        const [first, last] = searchText.split(' ');
        whereClause.OR = [
          { firstName: { contains: searchText } },
          { lastName: { contains: searchText } },
          {
            AND: [
              { firstName: { contains: first || '' } },
              { lastName: { contains: last || '' } },
            ],
          },
        ];
      }

      const profilesList = await this.prisma.profile.findMany({
        where: whereClause,
        orderBy: [
          {
            [sortCriteria.field]: sortCriteria.order,
          },
        ],
        skip: offset,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });

      // Count total profiles
      const profilesCount = await this.prisma.profile.count({
        where: whereClause,
      });

      return {
        profiles: profilesList || [],
        totalAmount: profilesCount || 0,
      };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async createChildProfile(data: CreateChildProfileDto) {
    try {
      const { idsToAdd, dataToInsert } =
        await this.checkIfProfileClientExist(data);

      // Insert only the new relations
      let childProfleRes: any;
      if (idsToAdd.length) {
        childProfleRes = await this.prisma.profileClient.createMany({
          data: dataToInsert,
        });
      } else {
        throw new RepositoryError('Profile Client already Exist !!');
      }
      return childProfleRes;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async updateMyProfile(updateData: UpdateMyProfileBodyDto) {
    try {
      const { id, ...data } = updateData;
      const updatedProfile: UpdatedProfile = await this.prisma.profile.update({
        where: { id },
        data,
      });
      return updatedProfile;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async checkIfProfileClientExist(data: CreateChildProfileDto) {
    // retrieve existing profile client Ids
    const existingProfileClientIds = await this.findProfileClientIdsByProfileId(
      data[0].profileId,
    );

    // get clientids from the data
    const clientIds = data.map((a) => a.clientId);

    // Determine which ids to add
    const idsToAdd = clientIds.filter(
      (clientId) => !existingProfileClientIds.includes(clientId),
    );

    const dataToInsert = data.filter((item) =>
      idsToAdd.includes(item.clientId),
    );
    return { idsToAdd, dataToInsert };
  }

  async findProfileClientIdsByProfileId(Id: number) {
    return this.prisma.profileClient
      .findMany({
        where: { profileId: Id },
        select: { clientId: true },
      })
      .then((result) => result.map((pg) => pg.clientId));
  }

  async findProfileByIdWithRole(id: number) {
    const profileData = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        client: true,
        manager: true,
        delegate: true,
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
        email: {
          where: {
            emailAddressType: {
              name: 'default',
            },
          },
        },
        phone: {
          where: {
            phoneType: {
              name: 'default',
            },
          },
        },
        profileRole: {
          include: {
            role: {
              include: {
                rolePermissionGroup: {
                  include: {
                    permissionGroup: true,
                  },
                },
                functionalArea: true,
              },
            },
          },
        },
      },
    });

    return profileData
      ? {
          ...profileData,
          email: profileData?.email[0],
          phone: profileData?.phone.length ? profileData.phone[0] : null,
          permissionGroups: profileData.profileRole.flatMap((profileRole) =>
            profileRole.role.rolePermissionGroup.map(
              (rolePermissionGroup) => rolePermissionGroup.permissionGroup,
            ),
          ),
          functionalAreas: profileData.profileRole.flatMap(
            (profileRole) => profileRole.role.functionalArea,
          ),
          profileRole: profileData.profileRole.flatMap(
            (profileRole) => profileRole.role,
          ),
        }
      : null;
  }

  async getbrandColor() {
    try {
      const brandColors: ListBrandColorResponse =
        await this.prisma.brandColor.findMany({
          select: {
            id: true,
            colorCode: true,
          },
          orderBy: {
            id: 'asc',
          },
        });
      return brandColors;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(ERRORMESSAGE.REPOSITORY_ERROR(error.message));
    }
  }

  async editBulkProfile(
    updateData: EditBulkProfileBodyDto,
  ): Promise<EditBuilkProfileResponseDto> {
    try {
      const {
        profileId,
        roleId,
        timezoneId,
        localeId,
        type,
        startDate,
        endDate,
      } = updateData;
      if (timezoneId) {
        const timezoneExists = await this.prisma.timeZone.findUnique({
          where: { id: timezoneId },
        });
        if (!timezoneExists) {
          throw new Error(`Timezone with ID ${timezoneId} does not exist.`);
        }
      }

      if (localeId) {
        const localeExists = await this.prisma.locale.findUnique({
          where: { id: localeId },
        });
        if (!localeExists) {
          throw new Error(`Locale with ID ${localeId} does not exist.`);
        }
      }
      let statusIds: number[] = [];
      if (startDate && endDate) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          startDate,
          endDate,
        );
      }
      const status: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE);

      const updatedProfile = await this.prisma.profile.updateMany({
        where: {
          id: {
            in: profileId,
          },
        },
        data: {
          timezoneId,
          localeId,
          isExternal: type,
          startDate,
          endDate,
          profileStatusId: status,
        },
      });

      await this.prisma.profileRole.updateMany({
        where: {
          profileId: {
            in: profileId,
          },
        },
        data: {
          roleId,
        },
      });
      return {
        count: updatedProfile.count,
        message: 'Profiles were updated successfully',
      };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getthemes() {
    try {
      const themes: ListThemeResponse =
        await this.prisma.interfacetheme.findMany({
          select: {
            id: true,
            themeImageUrl: true,
            themeName: true,
          },
        });
      return themes;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(ERRORMESSAGE.REPOSITORY_ERROR(error.message));
    }
  }

  async getLoginDetails(id: number, type?: string) {
    let exportPath: string = '';
    if (type && type === 'export') {
      const sixMonthsAgo: Date = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const loginData = await this.prisma.loginDetails.findMany({
        where: {
          profileId: id,
          loggedinAt: {
            gte: sixMonthsAgo,
          },
        },
        select: {
          id: true,
          applicationName: true,
          browserName: true,
          device: true,
          loggedinAt: true,
          isLoginSuccess: true,
          loginUrl: true,
          sourceIp: true,
          country: true,
          duration: true,
        },
      });
      exportPath = await this.exportLoginDetailsToCsv(loginData);
    }
    const loginData = await this.prisma.loginDetails.findMany({
      where: {
        profileId: id,
      },
    });

    const loginDetails = {
      loginDetails: loginData,
      exportPath,
    };

    return loginDetails;
  }

  async viewMyProfile(id) {
    try {
      const profileData = await this.prisma.profile.findFirst({
        where: { id },
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          preferredName: true,
          title: true,
          profileRole: {
            select: {
              role: {
                select: {
                  rolePermissionGroup: {
                    select: {
                      permissionGroup: true,
                    },
                  },
                  rolePermission: {
                    select: {
                      permission: true,
                    },
                  },
                  name: true,
                },
              },
            },
          },
          profileClient: {
            select: {
              id: true,
              clientId: true,
              startDate: true,
              endDate: true,
              createdAt: true,
              updatedAt: true,
              createdBy: true,
              updatedBy: true,
              profileId: true,
            },
          },
        },
      });
      const formatProfileData: FormattedProfileData[] = profileData
        ? [
            {
              firstName: profileData.firstName,
              middleName: profileData.middleName,
              lastName: profileData.lastName,
              preferredName: profileData.preferredName,
              title: profileData.title,
              roleDetails: profileData.profileRole.map((pr) => ({
                role: pr.role?.name,
                permissions:
                  pr.role?.rolePermission.map((rp) => ({
                    id: rp.permission?.id,
                    name: rp.permission?.name,
                  })) || [],
                permissionGroups:
                  pr.role?.rolePermissionGroup.map((rpg) => ({
                    id: rpg.permissionGroup?.id,
                    name: rpg.permissionGroup?.name,
                  })) || [],
              })),
              clientDetails: profileData.profileClient.map((pc) => ({
                id: pc.id,
                startDate: pc.startDate,
                endDate: pc.endDate,
                createdAt: pc.createdAt,
                updatedAt: pc.updatedAt,
                createdBy: pc.createdBy,
                updatedBy: pc.updatedBy,
                profileId: pc.profileId,
                clientId: pc.clientId,
              })),
            },
          ]
        : [];

      return formatProfileData;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findUser(email: string) {
    try {
      const profileData = await this.prisma.profile.findFirst({
        where: {
          email: {
            some: {
              emailAddress: email,
            },
          },
        },
      });
      return profileData;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findUserByUserName(userName: string) {
    try {
      const profileData = await this.prisma.profile.findFirst({
        where: {
          userName: userName
        },
      });
      return profileData;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findAllFunctionalArea() {
    try {
      const functionalAreaList = await this.prisma.functionalArea.findMany({
        select:{
          id: true,
          name: true,
        }
      });
      return functionalAreaList;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
  async findAllRole() {
    try {
      const roleList = await this.prisma.role.findMany({
        select:{
          id: true,
          name: true,
        }
      });
      return roleList;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
  async findAllPermission() {
    try {
      const permissionList = await this.prisma.permission.findMany({
        select:{
          id: true,
          name: true,
        }
      });
      return permissionList;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
  async findAllPermissionGroup() {
    try {
      const permissionGroupList = await this.prisma.permissionGroup.findMany({
        select:{
          id: true,
          name: true,
        }
      });
      return permissionGroupList;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
  async findAllLocale() {
    try {
      const localeList = await this.prisma.locale.findMany({
        select:{
          id: true,
          name: true,
        }
      });
      return localeList;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
  async findAllTimezone() {
    try {
      const timezoneList = await this.prisma.timeZone.findMany({
        select:{
          id: true,
          name: true,
        }
      });
      return timezoneList;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async importUserCreateProfile(updateData: ImportUserProfileDto) {
    try {
      const today = new Date();
      const oneYearAhead = new Date();
      oneYearAhead.setFullYear(today.getFullYear() + 1);
      const FailureData: UserInfoResponseDto = {};

      const emailAddressType = await this.prisma.emailAddressType.findFirst({});

      const data: any = {};
      if (updateData.preferredName) {
        data.preferredName = updateData.preferredName;
      }
      if (updateData.userName) {
        data.userName = updateData.userName;
      }
      if (updateData.phoneNumber) {
        const phoneCreate = await this.phoneNumberData(updateData);
        data.phone = {
          create: phoneCreate,
        };
      }
      if (updateData.delegateUser) {
        const delegateUserData = await this.delegateUserData(updateData);
        data.delegateId = delegateUserData;
      }
      if (updateData.timeZone) {
        const timeZoneData = await this.timeZoneData(updateData);
        data.timezoneId = timeZoneData;
      }
      if (updateData.locale) {
        const localeData = await this.localeData(updateData);
        data.localeId = localeData;
      }
      const profileStatus: { id: number } | null = await this.prisma.profileStatus.findUnique({
        where: {
          statusName: COMMON.STATUS.ACTIVE,
        },
        select: { id: true }
      })

      const profileData = await this.prisma.profile.create({
        data: {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          middleName: '',
          identityId: updateData.email,
          createdAt: new Date(),
          createdBy: updateData.updatedBy,
          updatedAt: new Date(),
          updatedBy: updateData.updatedBy,
          startDate: today.toISOString(),
          endDate: oneYearAhead.toISOString(),
          profileStatusId: profileStatus ? profileStatus.id : COMMON.ACTIVE_VALUE,
          email: {
            create: {
              emailAddress: updateData.email,
              emailAddressTypeId:
                emailAddressType && emailAddressType.id
                  ? emailAddressType.id
                  : 1,
              createdBy: updateData.updatedBy,
              updatedBy: updateData.updatedBy,
              isActive: true,
              correspondance: false,
            },
          },
          ...data,
        },
      });
      const updatedDataNew = { ...updateData, id: profileData.id || 0 };
      if (updatedDataNew.id) {
        const roleResponse = await this.RoleCheckAndAppend(updatedDataNew);
        const FunctionalAreaResponse =
          await this.FunctionalAreaCheckAndAppend(updatedDataNew);
        const PermissionResponse =
          await this.PermissionCheckAndAppend(updatedDataNew);
        const PermissionGroupResponse =
          await this.PermissionGroupCheckAndAppend(updatedDataNew);

        FailureData.role = roleResponse || '';
        FailureData.functionalArea = FunctionalAreaResponse || '';
        FailureData.permission = PermissionResponse || '';
        FailureData.permissionGroup = PermissionGroupResponse || '';
        FailureData.id = updatedDataNew.id;
      }
      return FailureData;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async importUserUpdateProfile(updateData: ImportUserProfileDto) {
    try {
      const FailureData: UserInfoResponseDto = {};

      const roleResponse = await this.RoleCheckAndAppend(updateData);
      const FunctionalAreaResponse =
        await this.FunctionalAreaCheckAndAppend(updateData);
      const PermissionResponse =
        await this.PermissionCheckAndAppend(updateData);
      const PermissionGroupResponse =
        await this.PermissionGroupCheckAndAppend(updateData);

      FailureData.role = roleResponse || '';
      FailureData.functionalArea = FunctionalAreaResponse || '';
      FailureData.permission = PermissionResponse || '';
      FailureData.permissionGroup = PermissionGroupResponse || '';

      await this.prisma.$transaction(async (prisma) => {
        const data: any = {};
        if (updateData.firstName) {
          data.firstName = updateData.firstName;
        }
        if (updateData.lastName) {
          data.lastName = updateData.lastName;
        }
        if (updateData.preferredName) {
          data.preferredName = updateData.preferredName;
        }
        if (updateData.userName) {
          data.userName = updateData.userName;
        }
        if (updateData.delegateUser) {
          const delegateUserData = await this.delegateUserData(updateData);
          data.delegateId = delegateUserData;
        }
        if (updateData.timeZone) {
          const timeZoneData = await this.timeZoneData(updateData);
          data.timezoneId = timeZoneData;
        }
        if (updateData.locale) {
          const localeData = await this.localeData(updateData);
          data.localeId = localeData;
        }
        if (updateData.email && updateData.emailId) {
          data.email = {
            update: {
              where: { id: updateData.emailId },
              data: { emailAddress: updateData.email },
            },
          };
        }
        if (updateData?.phoneNumber) {
          const phoneRegex = /^(\+\d{1,3})\s*(\d+)$/;
          const numberString: string = updateData.phoneNumber?.toString();
          const match = numberString.match(phoneRegex);

          if (updateData.phoneId) {
            data.phone = {
              update: {
                where: { id: updateData.phoneId },
                data: {
                  phoneNumber: match
                    ? match[2]
                    : updateData.phoneNumber?.toString(),
                  countryCode: match ? match[1] : '+91',
                },
              },
            };
          } else if (!updateData.phoneId) {
            const phoneCreate = await this.phoneNumberData(updateData);
            if (phoneCreate) {
              await prisma.phone.create({
                data: phoneCreate,
              });
            }
          }
        }

        await prisma.profile.update({
          where: { id: updateData.id },
          data: { ...data, updatedBy: updateData.updatedBy },
        });
      });
      return FailureData;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async RoleCheckAndAppend(updateData: ImportUserProfileDto) {
    try {
      if (updateData.role) {
        const existingIds = await this.prisma.profileRole
          .findMany({
            where: { profileId: updateData.id },
            select: { roleId: true },
          })
          .then((result) => result.map((pg) => pg.roleId));

        const idList: string[] = updateData.role.split(',');
        const List = await this.prisma.role.findMany({
          where: { name: { in: idList } },
          select: {
            id: true,
            name: true,
          },
        });

        const existingNames = List.map((data) => data.name);
        const nonExistent = idList.filter(
          (role) => !existingNames.includes(role),
        );

        const Ids = List.map((data) => data.id);
        const IdsToAdd = Ids.filter((data) => !existingIds.includes(data));
        const idsToRemove = existingIds.filter(
          (existId) => !Ids.includes(existId),
        );
        if (idsToRemove.length) {
          await this.prisma.profileRole.deleteMany({
            where: {
              profileId: updateData.id,
              roleId: { in: idsToRemove },
            },
          });
        }
        if (IdsToAdd.length) {
          await this.prisma.profileRole.createMany({
            data: IdsToAdd.map((roleId) => ({
              profileId: updateData.id,
              roleId,
            })),
          });
        }
        if (nonExistent.length) {
          return nonExistent.join(',');
        }
      }
      return '';
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async FunctionalAreaCheckAndAppend(updateData: ImportUserProfileDto) {
    try {
      if (updateData.functionalArea) {
        const existingIds = await this.prisma.profileFunctionalArea
          .findMany({
            where: { profileId: updateData.id },
            select: { functionalAreaId: true },
          })
          .then((result) => result.map((pg) => pg.functionalAreaId));
        const idList: string[] = updateData.functionalArea.split(',');
        const List = await this.prisma.functionalArea.findMany({
          where: { name: { in: idList } },
          select: {
            id: true,
            name: true,
          },
        });

        const existingNames = List.map((data) => data.name);
        const nonExistent = idList.filter(
          (data) => !existingNames.includes(data),
        );

        const Ids = List.map((data) => data.id);
        const IdsToAdd = Ids.filter((data) => !existingIds.includes(data));
        const idsToRemove = existingIds.filter(
          (existId) => !Ids.includes(existId),
        );
        if (idsToRemove.length) {
          await this.prisma.profileFunctionalArea.deleteMany({
            where: {
              profileId: updateData.id,
              functionalAreaId: { in: idsToRemove },
            },
          });
        }
        if (IdsToAdd.length) {
          await this.prisma.profileFunctionalArea.createMany({
            data: IdsToAdd.map((functionalAreaId) => ({
              profileId: updateData.id,
              functionalAreaId,
            })),
          });
        }
        if (nonExistent.length) {
          return nonExistent.join(',');
        }
      }
      return '';
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async PermissionCheckAndAppend(updateData: ImportUserProfileDto) {
    try {
      if (updateData.permission) {
        const existingIds = await this.prisma.profilePermission
          .findMany({
            where: { profileId: updateData.id },
            select: { permissionId: true },
          })
          .then((result) => result.map((pg) => pg.permissionId));

        const idList: string[] = updateData.permission.split(',');
        const List = await this.prisma.permission.findMany({
          where: { name: { in: idList } },
          select: {
            id: true,
            name: true,
          },
        });

        const existingNames = List.map((data) => data.name);
        const nonExistent = idList.filter(
          (data) => !existingNames.includes(data),
        );

        const Ids = List.map((data) => data.id);
        const IdsToAdd = Ids.filter((data) => !existingIds.includes(data));
        const idsToRemove = existingIds.filter(
          (existId) => !Ids.includes(existId),
        );
        if (idsToRemove.length) {
          await this.prisma.profilePermission.deleteMany({
            where: {
              profileId: updateData.id,
              permissionId: { in: idsToRemove },
            },
          });
        }
        if (IdsToAdd.length) {
          await this.prisma.profilePermission.createMany({
            data: IdsToAdd.map((permissionId) => ({
              profileId: updateData.id,
              permissionId,
            })),
          });
        }
        if (nonExistent.length) {
          return nonExistent.join(',');
        }
      }
      return '';
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async PermissionGroupCheckAndAppend(updateData: ImportUserProfileDto) {
    try {
      if (updateData.permissionGroup) {
        const existingIds = await this.prisma.profilePermissionGroup
          .findMany({
            where: { profileId: updateData.id },
            select: { permissionGroupId: true },
          })
          .then((result) => result.map((pg) => pg.permissionGroupId));
        const idList: string[] = updateData.permissionGroup.split(',');
        const List = await this.prisma.permissionGroup.findMany({
          where: { name: { in: idList } },
          select: {
            id: true,
            name: true,
          },
        });

        const existingNames = List.map((data) => data.name);
        const nonExistent = idList.filter(
          (data) => !existingNames.includes(data),
        );

        const Ids = List.map((data) => data.id);
        const IdsToAdd = Ids.filter((data) => !existingIds.includes(data));
        const idsToRemove = existingIds.filter(
          (existId) => !Ids.includes(existId),
        );
        if (idsToRemove.length) {
          await this.prisma.profilePermissionGroup.deleteMany({
            where: {
              profileId: updateData.id,
              permissionGroupId: { in: idsToRemove },
            },
          });
        }
        if (IdsToAdd.length) {
          await this.prisma.profilePermissionGroup.createMany({
            data: IdsToAdd.map((permissionGroupId) => ({
              profileId: updateData.id,
              permissionGroupId,
            })),
          });
        }
        if (nonExistent.length) {
          return nonExistent.join(',');
        }
      }
      return '';
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async phoneNumberData(updateData: ImportUserProfileDto) {
    try {
      if (updateData.phoneNumber) {
        const numberString: string = updateData.phoneNumber.toString();
        const phoenType = await this.prisma.phoneType.findFirst({});
        const phoneRegex = /^(\+\d{1,3})\s*(\d+)$/;
        const match = numberString.match(phoneRegex);
        return {
          createdBy: updateData.updatedBy,
          updatedBy: updateData.updatedBy,
          isActive: true,
          profileId: updateData.id,
          countryCode: match ? match[1] : '+91',
          phoneNumber: match ? match[2] : numberString,
          phoneTypeId: phoenType ? phoenType.id : 1,
          correspondance: true,
        };
      }
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async localeData(updateData: ImportUserProfileDto): Promise<number> {
    try {
      const localeData: LocaleDto | null = await this.prisma.locale.findFirst({
        where: { name: updateData.locale },
      });
      return localeData ? localeData.id : 0;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async timeZoneData(updateData: ImportUserProfileDto) {
    try {
      const timezone = await this.prisma.timeZone.findFirst({
        where: { name: updateData.timeZone },
      });
      const timezoneId: number =
        timezone &&
        timezone.id &&
        timezone.name &&
        timezone.name === updateData.timeZone
          ? timezone.id
          : 0;
      return timezoneId;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async delegateUserData(updateData: ImportUserProfileDto) {
    try {
      const delegateUserData = await this.prisma.profile.findFirst({
        where: {
          identityId: updateData.delegateUser,
        },
      });
      const delegateId: number =
        delegateUserData &&
        delegateUserData.id &&
        delegateUserData.identityId === updateData.delegateUser
          ? delegateUserData.id
          : updateData.updatedBy;
      return delegateId;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async exportLoginDetailsToCsv(loginData: any[]): Promise<string> {
    const dirPath = path.join(process.cwd(), 'export', 'logindetails');

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const fileName = 'login-history.csv';
    const filePath = path.join(dirPath, 'login-history.csv');
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'applicationName', title: 'Application Name' },
        { id: 'browserName', title: 'Browser Name' },
        { id: 'device', title: 'Device' },
        { id: 'loggedinAt', title: 'Logged In At' },
        { id: 'isLoginSuccess', title: 'Login Success' },
        { id: 'loginUrl', title: 'Login URL' },
        { id: 'sourceIp', title: 'Source IP' },
        { id: 'country', title: 'Country' },
        { id: 'duration', title: 'Duration' },
      ],
    });

    const formattedData = loginData.map((item) => ({
      ...item,
      duration: item.duration,
      loggedinAt: item.loggedinAt.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      }),
      isLoginSuccess: item.isLoginSuccess ? 'Yes' : 'No',
    }));

    await csvWriter.writeRecords(formattedData);
    const fileContent = fs.readFileSync(filePath);
    const s3Key = `${COMMON.LOGINEXPORTPATH}/${fileName}`;

    const s3Url = await this.s3Service.uploadImage({
      key: s3Key,
      body: fileContent,
      contentType: 'text/csv',
    });
    fs.unlinkSync(filePath);

    return s3Url;
  }

  async importUserDataEntry(
    updateData: ImportUserProfileDto,
    importProfileFileNameId: number,
    userinfo: string,
    UserProfileFailureData,
  ) {
    try {
      if (importProfileFileNameId) {
        const importProfileHistory =
          await this.prisma.importProfileHistory.create({
            data: {
              firstName: updateData.firstName,
              lastName: updateData.lastName,
              preferredName: updateData.preferredName ?? null,
              email: updateData.email,
              phoneNumber: updateData.phoneNumber?.toString() ?? null,
              userName: updateData.userName ?? null,
              delegateUser: updateData.delegateUser ?? null,
              functionalArea: updateData.functionalArea ?? null,
              role: updateData.role ?? null,
              permission: updateData.permission ?? null,
              permissionGroup: updateData.permissionGroup ?? null,
              timeZone: updateData.timeZone ?? null,
              locale: updateData.locale ?? null,
              isSuccess: true,
              importProfileFileNameId,
              createdAt: new Date().toISOString(),
              createdBy: updateData.updatedBy,
              userData: userinfo,
            },
          });
        if (importProfileHistory && importProfileHistory.id) {
          const keys = Object.keys(UserProfileFailureData[0]);
          const failedDetailsData = keys
            .filter((key) => UserProfileFailureData[0][key]?.trim())
            .map((key) => ({
              importProfileHistoryId: importProfileHistory.id,
              fieldName: key,
              failedReason: `(${UserProfileFailureData[0][key]}) these datas aren't present in the respective table, So we can't add or edit`,
            }));

          if (failedDetailsData.length > 0) {
            await this.prisma.importProfileFailedDetails.createMany({
              data: failedDetailsData,
            });
          }
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async createImportProfileFileName(fileName: string) {
    try {
      const importProfileFileName =
        await this.prisma.importProfileFileName.create({
          data: { fileName, createdAt: new Date().toISOString() },
        });
      return importProfileFileName && importProfileFileName.id
        ? importProfileFileName.id
        : 0;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getFilterRoles(roles: number[] | undefined): Promise<string> {
    return roles && roles.length > 0 ? `ProfileRole.RoleID IN (${roles})` : '';
  }

  async findHcpProfileById(id: number) {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  async findHcpProfileByIdentityId(identityId: string) {
    return this.prisma.profile.findUnique({ where: { identityId } });
  }

  async findHcpProfileByEmail(email: string) {
    return this.prisma.profile.findFirst({
      where: { email: { some: { emailAddress: email } } },
    });
  }

  async getPhoneTypes() {
    return this.prisma.phoneType.findMany({
      select: { id: true, name: true, isActive: true },
    });
  }

  async createHcpProfile({
    emailTypeId,
    email,
    roleIds,
    phone,
    clientIds,
    languageIds = [],
    ...profileHcpCreationData
  }: CreateHcpProfileToDbDto): Promise<CreateHcpProfileReturnType> {
    try {
      let phoneDetails;
      if (phone && phone.length) {
        phoneDetails = phone.map((ph) => ({
          countryCode: ph.countryCode,
          phoneNumber: ph.phoneNumber,
          phoneTypeId: ph.phoneTypeId,
          isActive: true,
          correspondance: ph.correspondance,
          createdBy: profileHcpCreationData.createdBy,
          updatedBy: profileHcpCreationData.createdBy,
        }));
      }
      let languageIdsArr: number[] = [];
      if (languageIds && languageIds.length) {
        languageIdsArr = languageIds;
      }
      const newHcpProfile = await this.prisma.profile.create({
        data: {
          ...profileHcpCreationData,
          endDate: profileHcpCreationData.endDate ?? null,
          updatedBy: profileHcpCreationData.createdBy,
          oneKeyId: profileHcpCreationData.oneKeyId,
          veevaId: profileHcpCreationData.veevaId,
          ocePersonalId: profileHcpCreationData.ocePersonalId,
          centrisId: profileHcpCreationData.centrisId,
          isSpeaker: profileHcpCreationData.isSpeaker,
          salutation: profileHcpCreationData.salutation,
          suffix: profileHcpCreationData.suffix,
          assistantName: profileHcpCreationData.assistantName,
          assistantEmail: profileHcpCreationData.assistantEmail,
          timezoneId: profileHcpCreationData?.timezoneId,
          localeId: profileHcpCreationData?.localeId,
          email: {
            create: {
              emailAddress: email,
              emailAddressTypeId: emailTypeId,
              createdBy: profileHcpCreationData.createdBy,
              updatedBy: profileHcpCreationData.createdBy,
              isActive: true,
              correspondance: false,
            },
          },
          ...(phoneDetails && { phone: { create: phoneDetails } }),
          profileClient: {
            create: clientIds?.map((clientId) => ({
              clientId,
              startDate: profileHcpCreationData?.startDate ?? null,
              endDate: profileHcpCreationData?.endDate ?? null,
              createdBy: profileHcpCreationData?.createdBy,
              updatedBy: profileHcpCreationData.createdBy,
            })),
          },
          ...(languageIdsArr.length > 0 && {
            profileFluentLanguages: {
              create: languageIdsArr.map((languageId) => ({
                fluentLanguagesId: languageId,
                createdAt: profileHcpCreationData.createdAt,
                createdBy: profileHcpCreationData.createdBy,
                updatedAt: profileHcpCreationData.updatedAt,
                updatedBy: profileHcpCreationData.createdBy,
              })),
            },
          }),
        },
        include: {
          email: true,
          phone: true,
          profileClient: true,
          profileFluentLanguages: true,
        },
      });

      return { ...newHcpProfile };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async updateProfilePhoto(
    profileId: number,
    updateData: Prisma.profileUpdateInput,
  ) {
    try {
      const updatedprofilePhoto: Profile = await this.prisma.profile.update({
        where: { id: profileId },
        data: updateData,
      });
      return updatedprofilePhoto;
    } catch (error) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async createProfileRolePermissionAlignment(
    profileAlignmentData: CreateProfileRolePermissionAlignmentDto,
  ): Promise<void> {
    try {
      if (
        profileAlignmentData.functionalAreaIds &&
        profileAlignmentData.functionalAreaIds.length > 0
      ) {
        const { functionalAreaIds } = profileAlignmentData;
        await this.prisma.$transaction(async (prisma) => {
          await this.prisma.profileFunctionalArea.createMany({
            data: functionalAreaIds.map((functionalAreaId) => ({
              profileId: profileAlignmentData.profileId,
              functionalAreaId,
              createdBy: profileAlignmentData.createdBy,
              updatedBy: profileAlignmentData.updatedBy,
            })),
          });

          if (
            profileAlignmentData.permissionIds &&
            profileAlignmentData.permissionIds.length > 0
          ) {
            await prisma.profilePermission.createMany({
              data: profileAlignmentData.permissionIds.map((permissionId) => ({
                profileId: profileAlignmentData.profileId,
                permissionId,
                createdBy: profileAlignmentData.createdBy,
                updatedBy: profileAlignmentData.updatedBy,
              })),
            });
          }

          if (
            profileAlignmentData.permissionGroupIds &&
            profileAlignmentData.permissionGroupIds.length > 0
          ) {
            await prisma.profilePermissionGroup.createMany({
              data: profileAlignmentData.permissionGroupIds.map(
                (permissionGroupId) => ({
                  profileId: profileAlignmentData.profileId,
                  permissionGroupId,
                  createdBy: profileAlignmentData.createdBy,
                  updatedBy: profileAlignmentData.updatedBy,
                }),
              ),
            });
          }
          if (profileAlignmentData.roleId) {
            await prisma.profileRole.create({
              data: {
                profileId: profileAlignmentData.profileId,
                roleId: profileAlignmentData.roleId,
              },
            });
          }
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async editHcpProfile({
    profileId,
    emailTypeId,
    email,
    roleIds,
    phone,
    clientIds,
    profileStatusId,
    languageIds = [],
    ...profileHcpCreationData
  }: EditHcpProfileDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        let phoneDetails;
        if (phone && phone.length) {
          phoneDetails = phone.map((ph) => ({
            countryCode: ph.countryCode,
            phoneNumber: ph.phoneNumber,
            phoneTypeId: ph.phoneTypeId,
            isActive: true,
            correspondance: ph.correspondance,
            updatedBy: profileHcpCreationData.createdBy,
          }));
        }

        // Update profile
        const updatedProfile = await prisma.profile.update({
          where: { id: profileId },
          data: {
            ...profileHcpCreationData,
            updatedBy: profileHcpCreationData.createdBy,
            profileStatusId
          },
        });

        // Update email
        if (email && emailTypeId) {
          await prisma.email.updateMany({
            where: { profileId },
            data: {
              emailAddress: email,
              emailAddressTypeId: emailTypeId,
              updatedBy: profileHcpCreationData.createdBy,
            },
          });
        }

        // Update phones
        if (phoneDetails && phoneDetails.length) {
          for (const ph of phoneDetails) {
            await prisma.phone.updateMany({
              where: {
                profileId,
                phoneNumber: ph.phoneNumber,
              },
              data: ph,
            });
          }
        }
        // Update profileClient
        if (clientIds && clientIds.length ) {
          await prisma.profileClient.deleteMany({
            where: { profileId },
          });

          await prisma.profileClient.createMany({
            data: clientIds.map((clientId) => ({
              profileId,
              clientId,
              createdBy : profileHcpCreationData.createdBy ,
              updatedBy : profileHcpCreationData.createdBy
            })),
          });
        }

        // Update profileFluentLanguages
        if (languageIds && languageIds.length) {
          for (const languageId of languageIds) {
            await prisma.profileFluentLanguages.updateMany({
              where: { profileId, fluentLanguagesId: languageId },
              data: {
                updatedBy: profileHcpCreationData.createdBy,
                updatedAt: new Date(),
              },
            });
          }
        }

        return { ...updatedProfile };
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async updateProfileRolePermissionAlignment(
    profileAlignmentData: EditProfileRolePermissionAlignmentDto,
  ) {
    try {
      const {
        profileId,
        roleIds,
        functionalAreaIds,
        permissionIds,
        permissionGroupIds,
        createdBy,
        updatedBy,
      } = profileAlignmentData;
      await this.prisma.$transaction(async (prisma) => {
        if (functionalAreaIds && functionalAreaIds.length > 0) {
          await this.prisma.profileFunctionalArea.deleteMany({
            where: { profileId },
          });

          // Add new functional areas
          await this.prisma.profileFunctionalArea.createMany({
            data: functionalAreaIds.map((functionalAreaId) => ({
              profileId,
              functionalAreaId,
              createdBy,
              updatedBy,
            })),
          });
        }

        // Update Permissions
        if (permissionIds && permissionIds.length > 0) {
          await prisma.profilePermission.deleteMany({
            where: { profileId },
          });

          await prisma.profilePermission.createMany({
            data: permissionIds.map((permissionId) => ({
              profileId,
              permissionId,
              createdBy,
              updatedBy,
            })),
          });
        }

        // Update Permission Groups
        if (permissionGroupIds && permissionGroupIds.length > 0) {
          await prisma.profilePermissionGroup.deleteMany({
            where: { profileId },
          });

          await prisma.profilePermissionGroup.createMany({
            data: permissionGroupIds.map((permissionGroupId) => ({
              profileId,
              permissionGroupId,
              createdBy,
              updatedBy,
            })),
          });
        }
        // Update Role
        if (roleIds && roleIds.length > 0) {
          await this.prisma.profileRole.deleteMany({
            where: { profileId },
          });

          await this.prisma.profileRole.createMany({
            data: roleIds.map((roleId) => ({
              profileId,
              roleId,
            })),
          });
        }
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findHcpProfileByIdentityIdExcludingProfileId(
    identityId: string,
    profileId: number,
  ): Promise<Profile | null> {
    return this.prisma.profile.findFirst({
      where: {
        identityId,
        NOT: { id: profileId },
      },
    });
  }

  async addAddressAndEmail(data: AddAddressAndEmailRequestDto) {
    try {
      const addressAndEmail: ( ProfileAddressDetails)[] = [];
      await this.checkPrimaryAddressAndEmails(data);

       await this.prisma.$transaction(async (prisma) => {
        for (const address of data.addresses) {
          const profileAddress: ProfileAddressDetails =
            await prisma.profileAddressDetails.create({
              data: {
                profileId: data.profileId,
                addressTypeId: address.addressTypeId,
                address: address.address,
                cityId: address.cityId,
                stateId: address.stateId,
                zipcode: address.zipcode,
                isPrimary: address.isPrimary,
                isActive: address.isActive,
                poBox: address.poBox,
                createdBy: data.createdBy,
                updatedBy: data.updatedBy,
                emailAddress: address.emailAddress,

              },
            select : {
                profileId: true,
                addressTypeId: true,
                address: true,
                cityId: true,
                stateId: true,
                zipcode: true,
                isPrimary: true,
                isActive: true,
                poBox: true,
                createdBy: true,
                updatedBy: true,
                emailAddress: true,
                createdAt : true ,
                updatedAt  : true ,
            },
            });
          addressAndEmail.push(profileAddress);
        }
      });
      console.log(addressAndEmail,'ssssss')
      return addressAndEmail;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async checkPrimaryAddressAndEmails(
    data: AddAddressAndEmailRequestDto,
  ): Promise<void> {
    const hasPrimaryAddress: boolean = data.addresses.some(
      (address) => address.isPrimary,
    );

    if (hasPrimaryAddress) {
      const primaryAddressCount: number =
        await this.prisma.profileAddressDetails.count({
          where: {
            profileId: data.profileId,
            isPrimary: true,
          },
        });

      if (primaryAddressCount > 1) {
        throw new Error(PROFILE_MESSAGES.EXISTINGDEFAULTADDRESS);
      }
    }
  }

  async addHcpBioProfessionpCredentials(
    hcpBioProfessionaData: CreateHcpBioProfessionRequestDTO,
  ): Promise<{
    hcpBioProfessionResponse: CreateHcpBioProfessionResponseDTO;
    profileSegmentationResponse: ProfileSegmentationResponseDto;
  }> {
    try {
      const { profileId, segmentationId, createdBy, updatedBy, ...rest } =
        hcpBioProfessionaData;

      const hcpBioData: HcpBioProfessionDTO = {
        profileId,
        createdBy,
        updatedBy,
        ...rest,
      };

      return await this.prisma.$transaction(async (prisma) => {
        const hcpBioProfessionResponse: CreateHcpBioProfessionResponseDTO =
          await prisma.hcpBioProfessional.create({
            data: hcpBioData,
          });

        const profileSegmentationResponse: ProfileSegmentationResponseDto =
          segmentationId !== undefined
            ? await prisma.profileSegmentation.create({
                data: {
                  profileId,
                  createdBy,
                  updatedBy,
                  segmentationId,
                },
              })
            : null;

        return { hcpBioProfessionResponse, profileSegmentationResponse };
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async updateHcpCredentials(
    hcpBioProfessionaData: UpdateHcpCredentialsRequestDto,
    hcpBioProfessionId: number,
    hcpBioSegmentationId: number | null = null,
  ): Promise<{
    hcpBioProfessionResponse: CreateHcpBioProfessionResponseDTO;
    profileSegmentationResponse: ProfileSegmentationResponseDto;
  }> {
    try {
      const { profileId, segmentationId, createdBy,updatedBy, ...rest } =
        hcpBioProfessionaData;
      const hcpBioData: HcpBioProfessionDTO = {
        profileId,
        createdBy,
        updatedBy,
        ...rest,
      };
      return await this.prisma.$transaction(async (prisma) => {
        const hcpBioProfessionResponse: CreateHcpBioProfessionResponseDTO =
        await prisma.hcpBioProfessional.upsert({
          where: { id: hcpBioProfessionId || 0 },
          update: {
           ...hcpBioData,
          },
          create: {
           ...hcpBioData,
           profileId
          },
        });

          const profileSegmentationResponse: ProfileSegmentationResponseDto =
          hcpBioSegmentationId
            ? await prisma.profileSegmentation.upsert({
                where: {
                  id: hcpBioSegmentationId,
                },
                update: {
                  profileId,
                  updatedBy,
                  segmentationId: segmentationId ?? 0,
                },
                create: {
                  profileId,
                  updatedBy,
                  createdBy,
                  segmentationId: segmentationId ?? 0,
                },
              })
            : null;
        return { hcpBioProfessionResponse, profileSegmentationResponse };
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findHcpProfessionById(profileId: number | undefined) {
    return this.prisma.hcpBioProfessional.findFirst({ where: { profileId } });
  }

  async findHcpProfileBySegmentationId(segmentationId: number | undefined) {
    return this.prisma.profileSegmentation.findFirst({
      where: { segmentationId },
    });
  }

  async addCommunicationPreference(
    data: CommunicationPreferencesRequestDto,
  ): Promise<CommunicationPreferencesResponseDto> {
    try {
      const createConnections = (items, key) =>
        items?.length
          ? { create: items.map((id) => ({ [key]: { connect: { id } } })) }
          : undefined;
      return await this.prisma.$transaction(async (prisma) => {
        const communicationPreferences =
          await prisma.communicationPreferences.create({
            data: {
              profileId: data.profileId,
              phoneTypeId: data.phoneTypeId,
              internationalPrefixId: data.internationalPrefix,
              phoneNumber: data.phoneNumber,
              phoneNumberExtension: data.phoneNumberExtension || null,
              faxNumber: data.faxNumber || null,
              createdBy: data.createdBy,
              updatedBy: data.createdBy,
          
            },
          
          });
        return {
          id: communicationPreferences.id,
          profileId: communicationPreferences.profileId,
          phoneTypeId: communicationPreferences.phoneTypeId,
          internationalPrefixId: communicationPreferences.internationalPrefixId,
          phoneNumber: communicationPreferences.phoneNumber,
          phoneNumberExtension:
            communicationPreferences.phoneNumberExtension || undefined,
          faxNumber: communicationPreferences.faxNumber || undefined,
          createdBy: communicationPreferences.createdBy,
        };
      });
    } catch (error: unknown) {
      throw new RepositoryError(
        `Repository Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  selectProfileClient = {
      select : {
        client : {
          select :{
            id : true ,
            name: true ,
            startDate: true ,
            endDate: true ,
            clientStatus : {
              select : {
                name : true 
              }
            }
          }
        }
   }}
    


  selectCreatedOrUpdatedByProfile = {
    select: {
      firstName: true,
      lastName: true,
    },
  };

  selectProfileEmailAddress = {
    select: {
      id: true,
      emailAddress: true,
      isPrimary: true,
    },
  };

  selectCommunicationPreferences = {
    select: {
      id: true,
      phoneType: {
        select: {
          id: true,
          name: true,
        },
      },
      internationalPrefix: {
        select: {
          id: true,
          name: true,
        },
      },
      phoneNumber: true,
      phoneNumberExtension: true,
      faxNumber: true,
    },
  };

  selectProfileAddressDetails = {
    select: {
      address: true,
      cityId: true,
      stateId : true ,
      zipcode: true,
      poBox: true,
      emailAddress: true,
      addressTypeId: true,
      isActive: true,
      isPrimary : true ,
    },
  };

  selectProfileFluentLanguages = {
    select: {
      fluentLanguages: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  };

  selectProfileFunctionalArea = {
    include: {
      functionalArea: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  };

  selectProfileRole = {
    include: {
      role: {
        select: {
          id: true,
          name: true,
          functionalArea: {
              select: {
                id: true,
                name: true,
              },
          },
        },
      },
    },
  };

  selectProfilePermission = {
    include: {
      permission: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          description: true,
        },
      },
    },
  };

  selectProfilePermissionGroup = {
    include: {
      permissionGroup: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          description: true,
        },
      },
    },
  };

  hcpBioProfessional = {
    select: {
      primaryDegree: {
        select: {
          id: true,
          name: true,
        },
      },
      secondaryDegree: {
        select: {
          id: true,
          name: true,
        },
      },
      medicalLicenseNumber: true,
      medicalLicenseEffectiveDate: true,
      medicalLicenseExpiryDate: true,
      medicalLicenseJurisdictions: {
        select: {
          id: true,
          name: true,
        },
      },
      medicalLicenseType: {
        select: {
          id: true,
          name: true,
        },
      },
      medicalLicenseStatus: {
        select: {
          id: true,
          name: true,
        },
      },
      medicalLicenseState: {
        select: {
          id: true,
          name: true,
        },
      },
      affiliationType: {
        select: {
          id: true,
          name: true,
        },
      },
      affiliationName: true,
      primarySpecialty: {
        select: {
          id: true,
          name: true,
        },
      },
      secondarySpecialty: {
        select: {
          id: true,
          name: true,
        },
      },
      npi: true,
      academicInstitutionTitle: true,
      isVAorDoD: true,
      isGovernmentEmployee: true,
      isHcpPrescriber: true,
      isMedicalFellow: true,
      isMedicalSpeaker: true,
      stateLicenseNumber: true,
      stateLicenseExpiry: true,
    },
  };

  selectProfileStatus = {
    select: {
      id: true,
      statusName: true,
    },
  };

  selectTimeZone = {
    select: {
      id: true,
      name: true,
    },
  };

  selectLocale = {
    select: {
      id: true,
      name: true,
    },
  };

  selectLogindetails = {
    select: {
      id: true,
      applicationName: true,
      browserName: true,
      device: true,
      loggedinAt: true,
      duration: true,
      isLoginSuccess: true,
      loginUrl: true,
      sourceIp: true,
      country: true,
    },
  };

  selectProfileThemes = {
    select: {
      interfaceTheme: {
        select: {
          id : true,
          themeName: true,
          themeImageUrl: true,
        },
      },
      brandColor: {
        select: {
          id: true ,
          colorCode: true,
        },
      },
    },
  };

  selectEmail = {
    select: {
      id: true,
      isActive: true,
      profileId: true,
      emailAddress: true,
      emailAddressType: {
        select: {
          id: true,
          name: true,
        },
      },
      correspondance: true,
    },
  };

  selectSegmentatiopn = {
    select: {
      segmentation: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  };
 
  

  async GetProfileDetailsById(
    id: number,
  ): Promise<ProfileDetailsResponseDto | null> {
    const profileData =
      await this.prisma.profile.findUnique({
        where: { id },
        include: {
          profileClient: this.selectProfileClient,
          createdByProfile: this.selectCreatedOrUpdatedByProfile,
          updatedByProfile: this.selectCreatedOrUpdatedByProfile,
          profileStatus: this.selectProfileStatus,
          profileEmailAddress: this.selectProfileEmailAddress,
          profileAddressDetails: this.selectProfileAddressDetails,
          timeZone: this.selectTimeZone,
          locale: this.selectLocale,
          profileFluentLanguages: this.selectProfileFluentLanguages,
          profileFunctionalArea: this.selectProfileFunctionalArea,
          profileRole: this.selectProfileRole,
          profilePermission: this.selectProfilePermission,
          profilePermissionGroup: this.selectProfilePermissionGroup,
          hcpBioProfessional: this.hcpBioProfessional,
          loginDetails: this.selectLogindetails,
          profileThemes: this.selectProfileThemes,
          email: this.selectEmail,
          profileSegmentation: this.selectSegmentatiopn,
          communicationPreferences : this.selectCommunicationPreferences
          
        },
      });
    if (!profileData) {
      return null;
    }

    return profileData;
  }

  async findProfileByCommunicationId(
    profileId: number,
  ): Promise<profilePhoneInfo | null> {
    return this.prisma.profilePhoneInfo.findFirst({
      where: { profileId },
      include: {
        internationalPrefix: true,
      },
    });
  }
  async findCommunicationPreferenceById(profileId: number | undefined) {
    return this.prisma.communicationPreferences.findFirst({ where: { profileId } });
  }

  async getProfileStatusList(status: string): Promise<profileStatus[]> {
    try {
      return await this.prisma.profileStatus.findMany({
      });
    } catch (error: unknown) {
      repositoryError(error);
    }
  }

  async getExistingProfileId(id: number): Promise<{
    id: number;
  } | null> {
    try {
      return await this.prisma.profile.findUnique({
        where: { id },
        select: { id: true },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
  async getProfileName(data: GetProfileNameReq) {
    return this.prisma.profile.findMany({
      where: {
        id: {
          in: data.profileIds
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      }
    });
  }
}

export default ProfileRepository;
