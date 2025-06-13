import { inject, injectable } from 'inversify';
import config from 'config';
import { DateTime } from 'luxon';
import { Prisma, profile as Profile } from '@prisma/client';
import axios, { HttpStatusCode } from 'axios';
import { ClientDTO } from 'src/client/dto/client.dto';
import TYPES from '../../dependencyManager/types';
import ProfileRepository from '../repositories/profileRepository';
import {
  CreateProfileDto,
  GetProfileListRequestDto,
  UpdateProfileDto,
  UpdateMyProfileBodyDto,
  DelegateManagerListDataToDbDto,
  CreateChildProfileRequestDto,
  CreateChildProfileDto,
  UpdatedProfile,
  EditBulkProfileBodyDto,
  LoginDetails,
  FormattedProfileData,
  ImportUserProfileDto,
  ImportChildUserProfileDto,
  ImportUserProfileResponseDto,
  UserInfoResponseDto,
  ListBrandColorResponse,
  ListThemeResponse,
  ProfileDto,
  DefaultEmailType,
  ProfileResponseDto,
  CreateHcpProfileReturnType,
  CreateHcpProfileDto,
  HcpProfileResponse,
  EditProfileRolePermissionAlignmentDto,
  CreateProfileRolePermissionAlignmentDto,
  EditHcpProfileDto,
  AddAddressAndEmailRequestDto,
  UpdateHcpCredentialsRequestDto,
  ProfileDetailsResponseDto,
  EditAndAddAddressAndEmailRequestDto,
  ExistingAddressesAndEmailForProfileDto,
  CreateHcpBioProfessionRequestDTO,
  CreateHcpBioProfessionResponseDTO,
  ProfileSegmentationResponseDto,
  CommunicationPreferencesResponseDto,
  CommunicationPreferencesRequestDto,
  ArchiveProfileRequestDto,
  CheckArchiveProfileDto,
  CheckExistingIdsDto,
  GetProfileNameReq,
} from '../dto/profile.dto';
import { ValidationError } from '../../error/validationError';
import ClientRepository from '../../client/repositories/clientRepository';
import { NotFoundError } from '../../error/notFoundError';
import DateService from '../../libs/dateService';
import { axiosRequest } from '../../utils/axios';
import { APIEndPoint, EntityTags } from '../../utils/constants';
import { extractRoleIdsFromProfileRoles, repositoryError } from '../../utils/utils';
import { MESSAGES } from '../../utils/message';
import HistoryService from '../../utils/historyService';
import { prepareImageData } from '../../utils/preapareImageData';
import { S3Service } from '../../libs/s3Service';
import { BadRequestError } from '../../error/badRequestError';
import { PROFILE_MESSAGES } from '../../utils/Messages/profileMessage';
import MasterProfileRepository from '../repositories/masterProfileRepository';
import { checkIds, checkRoleId } from '../../utils/validateIds';
import { dateValidation } from '../../utils/dateAndTime';
import validateDates from '../../utils/statusUtils';
import PermissionRepository from '../../permission/repositories/permissionRepository';
import RoleRepository from '../../roles/repositories/roleRepository';
import PermissionGroupRepository from '../../permissionGroup/repositories/permissionGroupRepository';
import FunctionalAreaRepository from '../../functionalArea/repositories/functionalAreaRepository';
import { COMMON } from '../../utils/common';

@injectable()
export default class ProfileService {
  private readonly profileRepository: ProfileRepository;

  private readonly masterProfileRepository: MasterProfileRepository;

  private readonly clientRepository: ClientRepository;

  private readonly dateService: DateService;

  private readonly historyService: HistoryService;

  private readonly s3Service: S3Service;

  private readonly roleRepository: RoleRepository;

  private readonly s3Url: string;

  private readonly permissionRepository: PermissionRepository;
  private readonly permissionGrouprepository: PermissionGroupRepository;

  private readonly functionalArearepository: FunctionalAreaRepository;

  constructor(
    @inject(TYPES.ProfileRepository) profileRepository: ProfileRepository,
    @inject(TYPES.ClientRepository) clientRepository: ClientRepository,
    @inject(TYPES.DateService) dateService: DateService,
    @inject(TYPES.HistoryService) historyService: HistoryService,
    @inject(TYPES.S3Service) s3Service: S3Service,
    @inject(TYPES.RoleRepository) roleRepository: RoleRepository,
    @inject(TYPES.MasterProfileRepository) masterProfileRepository: MasterProfileRepository,
    @inject(TYPES.PermissionRepository) permissionRepository: PermissionRepository,
    @inject(TYPES.PermissionGroupRepository) permissionGrouprepository: PermissionGroupRepository,
    @inject(TYPES.FunctionalAreaRepository)functionalArearepository: FunctionalAreaRepository,
    
  ) {
    this.profileRepository = profileRepository;
    this.masterProfileRepository = masterProfileRepository;
    this.clientRepository = clientRepository;
    this.dateService = dateService;
    this.historyService = historyService;
    this.roleRepository = roleRepository;
    this.s3Service = s3Service;
    this.permissionGrouprepository = permissionGrouprepository;
    this.permissionRepository = permissionRepository;
    this.functionalArearepository = functionalArearepository;
    this.s3Url = config.get<string>('aws.s3Url');
  }

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>('defaultEntity.defaultEndDate'));
  }

  async validatingProfileData(
    email: string| undefined | null,
    delegateId: number | undefined | null,
    managerId: number | undefined | null,
    interfaceThemeId: number | undefined | null,
    brandColorCodeId: number | null ,
  ) {

    if(email) {
      const existingProfileWithSameEmail =
      await this.profileRepository.findProfileByEmail(email);

    if (existingProfileWithSameEmail)
      throw new ValidationError(MESSAGES.ALREADY_EXIST_EMAIL(email));
    }

    if (delegateId) {
      const profile = await this.profileRepository.findProfileById(delegateId);
      if (!profile)
        throw new ValidationError(MESSAGES.NO_DELEGATE_ID_FOUND(delegateId));
    }
    if (managerId) {
      const manager = await this.profileRepository.findProfileById(managerId);
      if (!manager)
        throw new ValidationError(MESSAGES.NO_MANAGER_ID_FOUND(managerId));
    }
    if (interfaceThemeId) {
      const theme =
        await this.profileRepository.findthemebyId(interfaceThemeId);
      if (!theme) {
        throw new ValidationError(MESSAGES.NO_THEME_ID_FOUND(interfaceThemeId));
      }
    }
    if (brandColorCodeId) {
      const existingColor =
        await this.profileRepository.findbrancolorcodeId(brandColorCodeId);
      if (!existingColor) {
        throw new ValidationError(MESSAGES.NO_COLOR_CODE(brandColorCodeId));
      }
    }
  }

  async validateClientIds(clientIds: number[]) {
    for (const clientId of clientIds) {
      const client = await this.clientRepository.findClientById(clientId);
      if (!client) {
        throw new ValidationError(
          `There is no client with id: ${clientId} in the database`,
        );
      }
    }
  }

  async createProfile({
    email,
    employeeId,
    isExternal,
    createdBy,
    startDate,
    endDate,
    interfaceThemeId,
    brandColorCodeId,
    clientIds,
    delegateId,
    managerId,
    ...profileData
  }: CreateProfileDto) {
    const identityId = isExternal ? email : String(employeeId);
    const defaultEmailType = await this.profileRepository.getDefaultEmailType();
    if (!defaultEmailType) throw new Error(MESSAGES.DEFAULT_TYPE_NOT_FOUND);
    await this.validatingProfileData(
      email,
      delegateId,
      managerId,
      interfaceThemeId,
      brandColorCodeId,
    );

    if (identityId ) {
      const existingProfileWithSameIdentity: ProfileDto | null =
        await this.profileRepository.findProfileByIdentityId(identityId);

      if (existingProfileWithSameIdentity) {
        throw new ValidationError(
          PROFILE_MESSAGES.PROFILE_EMPLOYEE_ID_EXISTS(isExternal,identityId)
        );
      }
    }
    if (clientIds?.length) {
      const validClientIds =
        await this.clientRepository.getExistingClientIds(clientIds);

      const validIds: number[] = validClientIds.map((client) => client.id);
      const invalidIds: number[] = clientIds.filter(
        (id) => !validIds.includes(id),
      );

      if (invalidIds.length > 0) {
        throw new Error(MESSAGES.INVALID_CLIENTS_IDS(invalidIds));
      }
    }

    const endDateDefault: Date = this.getDefaultEndDate();
    const validatedStartDate: Date = startDate
      ? new Date(startDate)
      : new Date();
    const validatedEndDate: Date = endDate
      ? new Date(endDate)
      : endDateDefault;
    const finalEndDate: Date = validateDates({
      startDate: validatedStartDate,
      endDate: validatedEndDate,
    });

    const profileResData: ProfileResponseDto =
      await this.profileRepository.createProfile({
        ...profileData,
        sapIntegration: !!profileData.sapVendorId,
        createdBy,
        email,
        emailTypeId: defaultEmailType.id,
        isExternal,
        identityId,
        startDate: validatedStartDate.toISOString(),
        endDate: finalEndDate.toISOString(),
        interfaceThemeId,
        brandColorCodeId,
        clientIds,
        delegateId,
        managerId,
        fullName: `${profileData.firstName} ${profileData.middleName ? profileData.middleName + ' ' : ''}${profileData.lastName}`
      });
    await this.historyService.trackFieldChanges(
      'profile',
      0,
      profileData,
      createdBy,
    );
    return profileResData;
  }

  getUserActiveStatusByStartEndDate(
    startDate: Date | null,
    endDate: Date | null,
  ) {
    const [startOfTodayDate, endOfTodayDate] =
      this.dateService.getTodaysStartAndEndDates();

    if (!endDate) return false;

    const isEndDateAfterToday = DateTime.fromJSDate(endDate) > startOfTodayDate;

    if (!startDate) return isEndDateAfterToday;

    const isStartDateBeforeToday =
      DateTime.fromJSDate(startDate) < endOfTodayDate;

    return isStartDateBeforeToday && isEndDateAfterToday;
  }

  async getProfileList(data: GetProfileListRequestDto) {
    const todayEdgeDateTimes: [DateTime, DateTime] =
      this.dateService.getTodaysStartAndEndDates();
    return this.profileRepository.getProfileList(data, todayEdgeDateTimes);
  }

  async updateProfile({
    id,
    email,
    employeeId,
    isExternal,
    managerId,
    delegateId,
    updatedBy,
    startDate,
    endDate,
    interfaceThemeId,
    brandColorCodeId,
    clientIds,
    ...profileData
  }: UpdateProfileDto) {

    const identityId : string | undefined = isExternal ? email : String(employeeId);

    const defaultEmailType: DefaultEmailType | null =
      await this.profileRepository.getDefaultEmailType();
    if (!defaultEmailType)
      throw new Error('The default email type is not found');

    const existingProfileWithDefaultEmail =
      await this.profileRepository.findProfileByIdWithEmailAndDefaultEmailType(
        id,
      );
    if (!existingProfileWithDefaultEmail) {
      throw new ValidationError(`User not found with id: ${id}`);
    }

    const existingEmailAddress =
      existingProfileWithDefaultEmail.email[0].emailAddress;
    const emailId: number = existingProfileWithDefaultEmail.email[0].id;
    const existingIdentityId: string | null =
      existingProfileWithDefaultEmail.identityId;

    // If the user updates their email address.
    if (email && existingEmailAddress !== email) {
      const checkIsNewEmailExistsInDb =
        await this.profileRepository.findProfileByEmail(email);

      if (checkIsNewEmailExistsInDb) {
        throw new ValidationError(
          `There already exists a profile with such email: ${email}`,
        );
      }
    }

    // If the user updates their identityId
    if (identityId && existingIdentityId !== identityId) {
      const existingProfileWithSameIdentity: ProfileDto | null =
        await this.profileRepository.findProfileByIdentityId(identityId);

      if (existingProfileWithSameIdentity) {
        throw new ValidationError(
          `There already exists a profile with such ${isExternal ? 'email' : 'employeeId'}: ${identityId}`,
        );
      }
    }
    await this.validatingProfileData(
      email,
      delegateId,
      managerId,
      interfaceThemeId,
      brandColorCodeId,
    );

    await this.validateClientIds(clientIds);

    const defaultEndDate: Date = this.getDefaultEndDate();
    await this.historyService.trackFieldChanges(
      'profile',
      id,
      profileData,
      updatedBy,
    );
    const updatedProfile = await this.profileRepository.updateProfile({
      ...profileData,
      managerId,
      delegateId,
      id,
      sapIntegration: !!profileData.sapVendorId,
      updatedBy,
      email,
      emailId,
      isExternal,
      identityId,
      startDate,
      interfaceThemeId,
      brandColorCodeId,
      clientIds,
      endDate: startDate
        ? (endDate ??
          existingProfileWithDefaultEmail.endDate?.toISOString() ??
          defaultEndDate.toISOString())
        : null,
      fullName: `${profileData.firstName} ${profileData.middleName ? profileData.middleName + ' ' : ''}${profileData.lastName}`
    });
    const { profileRole, ...updatedProfileData } = updatedProfile;
    return {
      ...updatedProfileData,
      role: profileRole.map((pr) => ({
        id: pr.role.id,
        name: pr.role.name,
        description: pr.role.description,
        isExternal: pr.role.isExternal,
        startDate: pr.role.startDate,
        endDate: pr.role.endDate,
        statusId: pr.role.statusId,
      })),
    };
  }

  async getProfileById(profileId: number) {
    try {
      const profileData: ProfileDto | null =
        await this.profileRepository.findProfileById(profileId);

      if (!profileData) {
        throw new BadRequestError(
          PROFILE_MESSAGES.PROFILE_NOT_FOUND(profileId),
        );
      }

      const profileDetails: ProfileDetailsResponseDto | null =
        await this.profileRepository.GetProfileDetailsById(profileId);
      return profileDetails;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getDelegateManagerList(data: DelegateManagerListDataToDbDto) {
    return this.profileRepository.getDelegateManagerList(data);
  }

  async createChildProfile(
    data: CreateChildProfileRequestDto,
    authToken: string,
  ) {
    try {
      const masterProfile =
        await this.profileRepository.findProfileByIdToGetAllData(
          data.internalMasterId,
        );

      if (!masterProfile) {
        throw new NotFoundError('Master Profile not found');
      }

      const profileData: CreateChildProfileDto = data.clients.map((item) => {
        return {
          profileId: data.internalMasterId,
          clientId: item.clientId,
          startDate: item.startDate,
          endDate: item.endDate,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
        };
      });

      const childProfilePayload = {
        firstName: masterProfile.firstName,
        lastName: masterProfile.lastName,
        middleName: masterProfile.middleName,
        preferredName: masterProfile.preferredName,
        title: masterProfile.title,
        email: masterProfile?.email[0]?.emailAddress,
        profileStatus: masterProfile.profileStatus,
        isExternal: masterProfile.isExternal,
        sapIntegration: masterProfile.sapIntegration,
        internalMasterId: masterProfile.internalMasterId,
        externalMasterId: masterProfile.internalMasterId,
        delegateId: masterProfile.delegateId,
        sapVendorId: masterProfile.sapVendorId,
        roleIds: extractRoleIdsFromProfileRoles(masterProfile.profileRole),
        identityId: masterProfile.identityId,
        startDate: profileData[0]?.startDate,
        endDate: profileData[0]?.endDate,
      };

      // post request to Client Service
      const apiEndPoint = APIEndPoint.CHILD_PROFILE_API;
      await axiosRequest('POST', apiEndPoint, authToken, childProfilePayload);

      return await this.profileRepository.createChildProfile(profileData);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async updateMyProfile(
    updateData: UpdateMyProfileBodyDto,
    authHeader: string,
  ) {
    const updatedProfile: UpdatedProfile =
      await this.profileRepository.updateMyProfile(updateData);
    const baseURL = config.get<string>('childClientSeviceUrl');
    const url = `${baseURL}/api/v1/profiles/my-child-profile`;
    try {
      await axios.put(url, updateData, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      /*  */
    }
    return updatedProfile;
  }

  async getBrandcolor() {
    try {
      const getBrandColor: ListBrandColorResponse =
        await this.profileRepository.getbrandColor();
      return getBrandColor;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async gettheme() {
    try {
      const getThems: ListThemeResponse =
        await this.profileRepository.getthemes();
      return getThems;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editBulkProfile(updateData: EditBulkProfileBodyDto) {
    const updatedProfile =
      await this.profileRepository.editBulkProfile(updateData);
    return updatedProfile;
  }

  async getLoginDetails(id: number, type?: string) {
    const loginData: LoginDetails =
      await this.profileRepository.getLoginDetails(id, type);
    return loginData;
  }

  async viewMyProfile(userId) {
    const myProfile: FormattedProfileData[] =
      await this.profileRepository.viewMyProfile(userId);
    return myProfile;
  }

  async ImportUserProfile(
    validatedData: ImportUserProfileDto[],
    authHeader,
    updatedBy: number,
    fileName: string,
    relayChangesField: string[],
  ) {
    const getRelayProfileUser: ImportUserProfileDto[] = [];
    const usersStatus: ImportUserProfileResponseDto[] = [];
    let createdCount:number=0;
    let updatedCount:number=0;
    const fileNameId =
      await this.profileRepository.createImportProfileFileName(fileName);

    const functionalAreaDataList  = await this.profileRepository.findAllFunctionalArea();
    const roleList  = await this.profileRepository.findAllRole();
    const permissionList  = await this.profileRepository.findAllPermission();
    const permissionGroupList  = await this.profileRepository.findAllPermissionGroup();
    const localeList  = await this.profileRepository.findAllLocale();
    const timezoneList  = await this.profileRepository.findAllTimezone();

    for (const userData of validatedData) {
      if (userData.functionalArea) {

        const matchedArea = functionalAreaDataList.find(
          (area) => area.name.toLowerCase() === userData.functionalArea!.toLowerCase()
        );
      
        if (!matchedArea) {
          throw new BadRequestError(`Invalid functional area name '${userData.functionalArea}'`);
        } else {
          userData.functionalAreaIds = [matchedArea.id];
        }
      }

      if (userData.role) {
        const matchedArea = roleList.find(
          (role) => role.name.toLowerCase() === userData.role!.toLowerCase()
        );
      
        if (!matchedArea) {
          throw new BadRequestError(`Invalid role name '${userData.role}'`);
        } else {
          userData.roleIds = [matchedArea.id];
        }
      }

      if (userData.permission) {
        const matchedArea = permissionList.find(
          (permission) => permission.name.toLowerCase() === userData.permission!.toLowerCase()
        );
      
        if (!matchedArea) {
          throw new BadRequestError(`Invalid permission name '${userData.permission}'`);
        } else {
          userData.permissionIds = [matchedArea.id];
        }
      }

      if (userData.permissionGroup) {
        const matchedArea = permissionGroupList.find(
          (permissionGroup) => permissionGroup.name.toLowerCase() === userData.permissionGroup!.toLowerCase()
        );
      
        if (!matchedArea) {
          throw new BadRequestError(`Invalid permissionGroup name '${userData.permissionGroup}'`);
        } else {
          userData.permissionGroupIds = [matchedArea.id];
        }
      }

      if (userData.locale) {
        const matchedArea = localeList.find(
          (locale) => locale.name.toLowerCase() === userData.locale!.toLowerCase()
        );
      
        if (!matchedArea) {
          throw new BadRequestError(`Invalid locale name '${userData.locale}'`);
        } else {
          userData.localeId = matchedArea.id;
        }
      }

      if (userData.timeZone) {
        const matchedArea = timezoneList.find(
          (timezone) => timezone.name.toLowerCase() === userData.timeZone!.toLowerCase()
        );
      
        if (!matchedArea) {
          throw new BadRequestError(`Invalid timezone name '${userData.timeZone}'`);
        } else {
          userData.timezoneId = matchedArea.id;
        }
      }

      let checkUser = await this.profileRepository.findUser(
        userData.email,
      );
      if(!checkUser && userData.userName){
        checkUser = await this.profileRepository.findUserByUserName(
          userData.userName,
        );
      }
      let userinfo: string = '';
      userData.updatedBy = updatedBy;

      const UserProfile: ImportUserProfileResponseDto = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      };
      const UserProfileFailureData: UserInfoResponseDto[] = [];

      if (checkUser) {
        const existingProfileWithDefaultEmail =
          await this.profileRepository.findProfileByIdWithEmailAndDefaultEmailType(
            checkUser.id,
          );
        const existingProfilePhoneNumber =
          await this.profileRepository.findProfilephoneNumber(checkUser.id);

        if (existingProfileWithDefaultEmail) {
          const emailId: number = existingProfileWithDefaultEmail.email[0].id;
          const phoneId =
            existingProfilePhoneNumber &&
            existingProfilePhoneNumber.phone[0] &&
            existingProfilePhoneNumber.phone[0].id
              ? existingProfilePhoneNumber.phone[0].id
              : 0;

          //updating audit history 
          const excludeKeys = ['permission', 'permissionGroup', 'functionalArea', 'role', 'timeZone', 'locale'];
          const historyData = Object.fromEntries(
            Object.entries(userData).filter(([key]) => !excludeKeys.includes(key))
          );
          
          await this.historyService.trackFieldChanges(
            'profile',
             checkUser.id,
             historyData,
             updatedBy,
          );
          const userUpdateInfo: UserInfoResponseDto =
            await this.profileRepository.importUserUpdateProfile({
              ...userData,
              emailId,
              phoneId,
              id: checkUser.id,
            });
          updatedCount++;
          UserProfileFailureData.push(userUpdateInfo);
          UserProfile.id = checkUser.id;
          UserProfile.status = 'updated';
          userinfo = 'updated';
          userData.identityId = checkUser.identityId;
          
          delete userData.roleIds
          delete userData.permissionIds
          delete userData.permissionGroupIds
          delete userData.functionalAreaIds
          delete userData.timezoneId
          delete userData.localeId
          getRelayProfileUser.push(userData);
        }
      } else if (!checkUser) {
        const importUserCreateProfile: UserInfoResponseDto =
          await this.profileRepository.importUserCreateProfile(userData);

        UserProfile.id = importUserCreateProfile.id
          ? importUserCreateProfile.id
          : 0;
        delete importUserCreateProfile.id;
        UserProfileFailureData.push(importUserCreateProfile);
        UserProfile.status = 'created';
        userinfo = 'created';

        //updating audit history 
        const excludeKeys = ['permission', 'permissionGroup', 'functionalArea', 'role', 'timeZone', 'locale'];
        const historyData = Object.fromEntries(
          Object.entries(userData).filter(([key]) => !excludeKeys.includes(key))
        );
        await this.historyService.trackFieldChanges(
          'profile',
          0,
          historyData,
          updatedBy,
        );

      await this.profileRepository.importUserDataEntry(
        userData,
        fileNameId,
        userinfo,
        UserProfileFailureData,
      );
      createdCount++;
      delete userData.roleIds
      delete userData.permissionIds
      delete userData.permissionGroupIds
      delete userData.functionalAreaIds
      delete userData.timezoneId
      delete userData.localeId
    }
    usersStatus.push({...userData,...UserProfile});
    }
    if (getRelayProfileUser.length > 0) {
      await this.updateChildProfile(
        getRelayProfileUser,
        fileName,
        relayChangesField,
        authHeader,
      );
    }
    return {
      totalCreatedRecords : createdCount,
      totalUpdatedRecords : updatedCount,
      data: usersStatus
    };
  }

  async updateChildProfile(
    validatedData: ImportUserProfileDto[],
    fileName: string,
    relayChangesField: string[],
    authHeader: string,
  ) {
    const autoPropagateFields = [
      'functionalArea',
      'role',
      'permission',
      'permissionGroup',
      'timeZone',
      'locale',
    ];
    const relayFields = [
      'firstName',
      'lastName',
      'preferredName',
      'delegateUser',
      'phoneNumber',
      'email',
    ];

    const updatedProfileData: ImportChildUserProfileDto[] = [];
    for (const profile of validatedData) {
      const combinedChanges: ImportChildUserProfileDto = {
        identityId: profile.identityId,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        preferredName: profile.preferredName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        delegateUser: profile.delegateUser || '',
        functionalArea: '',
        role: '',
        permission: '',
        permissionGroup: '',
        timeZone: '',
        locale: '',
        updatedBy: profile.updatedBy,
        fileName,
      };

      autoPropagateFields.forEach((field) => {
        if (profile[field]) {
          combinedChanges[field] = profile[field];
        }
      });
      if (relayChangesField && relayChangesField.length !== 0) {
        relayFields.forEach((field) => {
          if (relayChangesField.includes(field) && profile[field]) {
            combinedChanges[field] = profile[field];
          } else {
            delete combinedChanges[field];
          }
        });
      }

      updatedProfileData.push(combinedChanges);
    }
    const baseURL = config.get<string>('childClientSeviceUrl');
    const url = `${baseURL}/api/v1/profiles/child_profile_relay_changes`;
    try {
      await axios.post(url, updatedProfileData, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      /*  */
    }
  }

  async createHcpProfile({
    email,
    employeeId,
    isExternal,
    createdBy,
    startDate,
    endDate,
    oneKeyId,
    veevaId,
    ocePersonalId,
    centrisId,
    isSpeaker,
    cloneId,
    type,
    ...hcpProfileData
  }: CreateHcpProfileDto): Promise<HcpProfileResponse> {
    const identityId: string = isExternal ? email : String(employeeId);
    const defaultEmailType = await this.profileRepository.getDefaultEmailType();
    if (!defaultEmailType)
      throw new Error('The default email type is not found');

    const existingHcpProfileWithSameEmail =
      await this.profileRepository.findHcpProfileByEmail(email);

    if (existingHcpProfileWithSameEmail)
      throw new ValidationError(
        `There already exists a profile with such email: ${email}`,
      );

    if (hcpProfileData.clientId) {
      const parentClient: ClientDTO | null =
        await this.clientRepository.findClientById(hcpProfileData.clientId);
      if (!parentClient) {
        throw new NotFoundError(
          MESSAGES.NOT_FOUND_CLIENTS_IDS(hcpProfileData.clientId),
        );
      }
    }

    const existingHcpProfileWithSameIdentity =
      await this.profileRepository.findHcpProfileByIdentityId(identityId);

    if (existingHcpProfileWithSameIdentity)
      throw new ValidationError(
        `There already exists a profile with such ${isExternal ? 'email' : 'employeeId'}: ${identityId}`,
      );

    if (hcpProfileData.delegateId) {
      const hcpdelegate = await this.profileRepository.findHcpProfileById(
        hcpProfileData.delegateId,
      );
      if (!hcpdelegate)
        throw new ValidationError(
          `There is no profile with id: ${hcpProfileData.delegateId} to add as a delegate`,
        );
    }

    // Validation for phone types
    if (hcpProfileData.phone) {
      const phoneTypeIds = (await this.profileRepository.getPhoneTypes()).map(
        (item) => item.id,
      );
      const phoneTypeIdsNotFound: number[] = Array.from(
        new Set(
          hcpProfileData.phone
            ?.filter((ph) => !phoneTypeIds.includes(ph.phoneTypeId))
            .map((ph) => ph.phoneTypeId),
        ),
      );
      if (phoneTypeIdsNotFound.length) {
        throw new ValidationError(
          `There is no phone type(s) with Id(s): ${JSON.stringify(phoneTypeIdsNotFound)}`,
        );
      }
    }
    if (type === COMMON.CLONE && !cloneId) {
      throw new Error(MESSAGES.CLONE_ID_REQUIRED);
    }
    if (cloneId && type === COMMON.CLONE) {
      const validCloneData: { id: number } | null | undefined =
        await this.profileRepository.findValidCloneId(cloneId);
      if (!validCloneData) {
        throw new Error(MESSAGES.INVALID_CLONED_ID(cloneId));
      }
    }

    const defaultEndDate = this.getDefaultEndDate();
    const hcpProfile: CreateHcpProfileReturnType =
      await this.profileRepository.createHcpProfile({
        ...hcpProfileData,
        sapIntegration: !!hcpProfileData.sapVendorId,
        createdBy,
        email,
        emailTypeId: defaultEmailType.id,
        isExternal,
        identityId,
        startDate,
        endDate: startDate ? (endDate ?? defaultEndDate.toISOString()) : null,
        oneKeyId,
        veevaId,
        ocePersonalId,
        centrisId,
        isSpeaker,
        salutation: hcpProfileData?.salutation,
        suffix : hcpProfileData?.suffix,
        assistantName : hcpProfileData?.assistantName,
        assistantEmail: hcpProfileData?.assistantEmail,
        phone: hcpProfileData.phone,
        languageIds: hcpProfileData.languageIds,
      });

    const photo = hcpProfileData?.photo;
    let photoUrl: string = '';
    if (photo) {
      const {
        key,
        imageBuffer,
        contentType,
      }: { key: string; imageBuffer: Buffer; contentType: string } =
        prepareImageData(photo as string, hcpProfile.id);

      await this.s3Service.uploadImage({
        key,
        body: imageBuffer,
        contentType,
      });

      photoUrl = `${this.s3Url}/${key}`;
      const updateData: Prisma.profileUpdateInput = {
        photo: { set: photoUrl },
      };

      await this.profileRepository.updateProfilePhoto(
        hcpProfile.id,
        updateData,
      );
    }
    return {
      hcpProfile: {
        ...hcpProfile,
        photo: photoUrl,
      },
    };
  }

  async createProfileRolePermissionAlignment(
    profileAlignmentData: CreateProfileRolePermissionAlignmentDto,
  ): Promise<void> {
    try {
      const checkExistingProfileId: CheckExistingIdsDto =
        await this.profileRepository.getExistingProfileId(
          profileAlignmentData?.profileId,
        );
      if (!checkExistingProfileId) {
        throw new NotFoundError(
          PROFILE_MESSAGES.INVALID_PROFILE_ID(profileAlignmentData?.profileId),
        );
      }
      // role
      if (profileAlignmentData?.roleId) {
        await checkIds(
          Array.of(profileAlignmentData?.roleId),
          this.roleRepository.getExistingRoleIds.bind(this.roleRepository),
          EntityTags.ROLE,
        );
      }

      // functional Area
      if (
        profileAlignmentData?.functionalAreaIds &&
        profileAlignmentData?.functionalAreaIds?.length
      ) {
        await checkIds(
          profileAlignmentData?.functionalAreaIds,
          this.functionalArearepository.getExistingFunctionalAreaIds.bind(
            this.functionalArearepository,
          ),
          EntityTags.FUNCTIONAL_AREA,
        );
      }

      // permission
      if (
        profileAlignmentData?.permissionIds &&
        profileAlignmentData?.permissionIds?.length
      ) {
        await checkIds(
          profileAlignmentData?.permissionIds,
          this.permissionRepository.getExistingPermissionIds.bind(
            this.permissionRepository,
          ),
          EntityTags.PERMISSION,
        );
      }

      // permission grp
      if (
        profileAlignmentData?.permissionGroupIds &&
        profileAlignmentData?.permissionGroupIds?.length
      ) {
        await checkIds(
          profileAlignmentData?.permissionGroupIds,
          this.permissionGrouprepository.getExistingPermissionGroupIds.bind(
            this.permissionGrouprepository,
          ),
          EntityTags.PERMISSION_GROUP,
        );
      }
      // align here
      await this.profileRepository.createProfileRolePermissionAlignment(
        profileAlignmentData,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editHcpProfile({
    profileId,
    email,
    employeeId,
    isExternal,
    createdBy,
    startDate,
    endDate,
    oneKeyId,
    veevaId,
    ocePersonalId,
    centrisId,
    ...hcpProfileData
  }: EditHcpProfileDto): Promise<HcpProfileResponse> {
    try {
      const identityId: string = isExternal ? email : String(employeeId);
        const profileData =
        await this.profileRepository.findProfileById(
          profileId,
        );

      if (!profileData) {
        throw new  Error(MESSAGES.INVALID_PROFILE_IDS(profileId));
      }

      const defaultEmailType: DefaultEmailType =
        await this.profileRepository.getDefaultEmailType();
      if (!defaultEmailType) throw new Error(MESSAGES.DEFAULT_TYPE_NOT_FOUND);

      const existingHcpProfileWithSameIdentity: Profile | null =
        await this.profileRepository.findHcpProfileByIdentityIdExcludingProfileId(
          identityId,
          profileId,
        );

      if (existingHcpProfileWithSameIdentity)
        throw new ValidationError(
          MESSAGES.ALREADY_EXIST_EMAIL(
            `${isExternal ? 'email' : 'employeeId'}: ${identityId}`,
          ),
        );

      // Validation for phone types
      if (hcpProfileData.phone) {
        const phoneTypeIds: number[] = (
          await this.profileRepository.getPhoneTypes()
        ).map((item) => item.id);
        const phoneTypeIdsNotFound: number[] = Array.from(
          new Set(
            hcpProfileData.phone
              ?.filter((ph) => !phoneTypeIds.includes(ph.phoneTypeId))
              .map((ph) => ph.phoneTypeId),
          ),
        );
        if (phoneTypeIdsNotFound.length) {
          throw new ValidationError(
            MESSAGES.PHONE_TYPE_NOT_FOUND(
              `${JSON.stringify(phoneTypeIdsNotFound)}`,
            ),
          );
        }
      }

      const defaultEndDate: Date = this.getDefaultEndDate();
      // const hcpProfile: EditHcpProfileDto =
      await this.profileRepository.editHcpProfile({
        profileId,
        ...hcpProfileData,
        sapIntegration: !!hcpProfileData.sapVendorId,
        createdBy,
        email,
        emailTypeId: defaultEmailType.id,
        isExternal,
        startDate,
        endDate: startDate ? (endDate ?? defaultEndDate.toISOString()) : null,
        oneKeyId,
        veevaId,
        ocePersonalId,
        centrisId,
        salutation: hcpProfileData.salutation,
        suffix: hcpProfileData.suffix,
        assistantName: hcpProfileData.assistantName,
        assistantEmail: hcpProfileData.assistantEmail,
        phone: hcpProfileData.phone,
        languageIds: hcpProfileData.languageIds,
        profileStatusId : hcpProfileData.profileStatusId
      });

      const photo: string | undefined = hcpProfileData?.photo;
      let photoUrl: string = '';
      if (photo) {
        const {
          key,
          imageBuffer,
          contentType,
        }: { key: string; imageBuffer: Buffer; contentType: string } =
          prepareImageData(photo as string, profileId);

        await this.s3Service.uploadImage({
          key,
          body: imageBuffer,
          contentType,
        });

        photoUrl = `${this.s3Url}/${key}`;
        const updateData: Prisma.profileUpdateInput = {
          photo: { set: photoUrl },
        };

        await this.profileRepository.updateProfilePhoto(profileId, updateData);
      }
      return {
        hcpProfile: { id: profileId, photo: photoUrl },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async updateProfileRolePermissionAlignment(
    profileAlignmentData: EditProfileRolePermissionAlignmentDto,
  ) {
    await this.profileRepository.updateProfileRolePermissionAlignment(
      profileAlignmentData,
    );
  }

  async addAddressAndEmail(data: AddAddressAndEmailRequestDto) {
    return this.profileRepository.addAddressAndEmail(data);
  }

  async addCommunicationPreference(data: CommunicationPreferencesRequestDto) {
    try {
      if (data.profileId) {
        const profile: ProfileDto | null =
          await this.profileRepository.findProfileById(data.profileId);
        if (!profile)
          throw new Error(PROFILE_MESSAGES.INVALID_PROFILE_ID(data.profileId));


        const isAlreadyExist: CommunicationPreferencesResponseDto | null =
        await this.profileRepository.findCommunicationPreferenceById(data.profileId);
        if (isAlreadyExist) {
          throw new BadRequestError(
            MESSAGES.COMMUNICATION_PREFERENCE_ALREADY_EXIST_FOR_PROFILE,
          );
        }

        const communicationId =
          await this.profileRepository.findProfileByCommunicationId(
            data.profileId,
          );
        if (communicationId)
          throw new Error(
            PROFILE_MESSAGES.PROFILE_ALREADY_HAVE_COMMUNICATION_PREFERENCE(
              data.profileId,
            ),
          );
      }
      const addCommunicationPreferences: CommunicationPreferencesResponseDto =
        await this.profileRepository.addCommunicationPreference(data);

      return addCommunicationPreferences;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async UpdateCommunicationPreferences(
    data: CommunicationPreferencesRequestDto,
    profileId: number,
    updatedBy: number,
  ) {
    try {
      if (profileId) {
        const profile: ProfileDto | null =
          await this.profileRepository.findProfileById(profileId);
        if (!profile) throw new Error(MESSAGES.INVALID_PROFILE_IDS(profileId));
      }
      const communicationPreferenceId: number | null =
        await this.masterProfileRepository.findProfileByIdCommunication(
          profileId,
        );
      if (!communicationPreferenceId) {
        throw new Error(
          PROFILE_MESSAGES.COMMUNICATION_PREFERENCES_DO_NOT_EXIST,
        );
      }
      const addCommunicationPreferences: CommunicationPreferencesResponseDto =
        await this.masterProfileRepository.UpdateCommunicationPreferences(
          data,
          profileId,
          updatedBy,
          communicationPreferenceId,
        );
      return addCommunicationPreferences;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async addHcpBioProfessionpCredentials(
    data: CreateHcpBioProfessionRequestDTO,
  ) {
    try {
      const {
        roleId,
        profileId,
        medicalLicenseEffectiveDate,
        medicalLicenseExpiryDate,
      } = data;
      const isAlreadyExist: CreateHcpBioProfessionResponseDTO | null =
        await this.profileRepository.findHcpProfessionById(profileId);
      if (isAlreadyExist) {
        throw new BadRequestError(
          MESSAGES.SELECTED_PROFILE_IS_ALREADY_EXIST_IN_HCP_BIO_PROFESSION,
        );
      }
      if (roleId) {
        await checkRoleId(
          [roleId],
          this.roleRepository.getExistingRoleIds.bind(this.roleRepository),
          EntityTags.ROLE,
        );
      }
      const isValidDate = dateValidation(
        medicalLicenseEffectiveDate,
        medicalLicenseExpiryDate,
      );
      if (!isValidDate) {
        throw new ValidationError(
          PROFILE_MESSAGES.MEDICAL_LICENSE_DATE_ERROR(
            medicalLicenseEffectiveDate,
            medicalLicenseExpiryDate,
          ),
        );
      }

      const { hcpBioProfessionResponse, profileSegmentationResponse } =
        await this.profileRepository.addHcpBioProfessionpCredentials(data);
      return {
        ...hcpBioProfessionResponse,
        profileSegmentation: profileSegmentationResponse,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async updateHcpBioProfessionCredentials(
    data: CreateHcpBioProfessionRequestDTO,
  ) {
    try {
  
      const { hcpBioProfessionResponse, profileSegmentationResponse } =
      await this.profileRepository.updateHcpCredentials(
        data, 
        data?.profileId, 
        data?.segmentationId
      );
      return {
        ...hcpBioProfessionResponse,
        profileSegmentation: profileSegmentationResponse,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editAndAddAddressAndEmail(
    data: EditAndAddAddressAndEmailRequestDto,
  ): Promise<void> {
    try {
      const { profileId, addresses } = data;

      const existingProfileId: ProfileDto | null =
        await this.profileRepository.findProfileById(profileId);
      if (!existingProfileId) {
        throw new NotFoundError(PROFILE_MESSAGES.INVALID_PROFILE_ID(profileId));
      }

      if (addresses.filter((a) => a.isPrimary).length > 1) {
        throw new ValidationError(PROFILE_MESSAGES.PRIMARY_ADDRESS_ERROR);
      }

      await this.masterProfileRepository.editAndAddAddressAndEmail(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async archiveProfile(data: ArchiveProfileRequestDto) {
    const archiveProfiles: CheckArchiveProfileDto =
      await this.masterProfileRepository.checkIfArchiveProfileExist(data);

    const foundProfileIds: Set<number> = new Set(
      archiveProfiles.map((permissionItem) => permissionItem.id),
    );
    const missingProfileIds: number[] = data.profileIds.filter(
      (id) => !foundProfileIds.has(id),
    );
    if (missingProfileIds.length !== 0)
      return {
        status: HttpStatusCode.BadRequest,
        message: PROFILE_MESSAGES.INVALID_PROFILE_IDS(missingProfileIds),
      };
    const archivedProfileIds: number[] = archiveProfiles
      .filter((profileItem) => profileItem.archivedAt !== null)
      .map((profileItem) => profileItem.id);
    if (archivedProfileIds.length !== 0)
      return {
        status: HttpStatusCode.BadRequest,
        message: PROFILE_MESSAGES.PROFILE_ALREADY_ARCHIVED(archivedProfileIds),
      };

    await this.masterProfileRepository.archivePermission(data);
    return {
      status: HttpStatusCode.Ok,
      message: PROFILE_MESSAGES.PROFILE_ARCHIVED_SUCCESSFULLY,
    };
  }

  async getProfileName(data: GetProfileNameReq) {
    return this.profileRepository.getProfileName(data);
  }
}
