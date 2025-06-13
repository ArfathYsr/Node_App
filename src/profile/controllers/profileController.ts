import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { MESSAGES } from '../../utils/message';
import { PROFILE_MESSAGES } from '../../utils/Messages/profileMessage';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import ProfileService from '../services/profileService';
import {
  CreateProfileDto,
  UpdateProfileDto,
  UpdateProfileEmailPhoneRoleResponseDto,
  GetProfileListRequestDto,
  GetProfilesListResponseDto,
  DelegateManagerListDataToDbDto,
  DelegateManagerListResponseDto,
  CreateChildProfileRequestDto,
  CreateChildProfileReponseDto,
  UpdateMyProfileBodyDto,
  UpdatedProfile,
  EditBulkProfileBodyDto,
  EditBuilkProfileResponseDto,
  LoginDetails,
  FormattedProfileData,
  ProfileResponseDto,
  ImportUserProfileDto,
  ListBrandColorResponse,
  ListThemeResponse,
  CreateHcpProfileDto,
  HcpProfileResponse,
  EditProfileRolePermissionAlignmentDto,
  CreateProfileRolePermissionAlignmentDto,
  EditHcpProfileDto,
  EditHcpProfileResponse,
  AddAddressAndEmailRequestDto,
  CreateHcpBioProfessionRequestDTO,
  UpdateHcpCredentialsRequestDto,
  ProfileDetailsResponseDto,
  EditAndAddAddressAndEmailRequestDto,
  CreateHcpBioProfessionResponseDTO,
  CommunicationPreferencesRequestDto,
  CommunicationPreferencesResponseDto,
  ArchiveProfileRequestDto,
  ArchiveProfileResponseDto,
  HcpBioProfessionresponseDto,
  GetProfileNameReq,
  GetProfileNameRes,
  ImportUserProfileResponseData,
} from '../dto/profile.dto';
import { processFile } from '../../utils/utils';
import { COMMON } from '../../utils/common';

@injectable()
export default class ProfileController {
  constructor(
    @inject(TYPES.ProfileService)
    private readonly profileService: ProfileService,
  ) {}

  async createProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    try {
      const data: CreateProfileDto = req.body;
      const profile: ProfileResponseDto =
        await this.profileService.createProfile({ ...data, createdBy });
      res
        .status(HttpStatusCode.Created)
        .json({ message: MESSAGES.USER_CREATED_SUCCESSFULLY, profile });
    } catch (error) {
      next(error);
    }
  }

  async getProfileList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: GetProfileListRequestDto = req.body;
      const profileList: GetProfilesListResponseDto =
        await this.profileService.getProfileList(data);
      res.status(HttpStatusCode.Ok).json({ profileList });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: UpdateProfileDto = req.body;
      const profile: UpdateProfileEmailPhoneRoleResponseDto =
        await this.profileService.updateProfile({
          ...data,
          updatedBy,
          id: parseInt(req.params.id, 10),
        });
      res.status(HttpStatusCode.Ok).json({ profile });
    } catch (error) {
      next(error);
    }
  }

  async getProfileById(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const profileData: ProfileDetailsResponseDto | null =
        await this.profileService.getProfileById(parseInt(req.params.id, 10));
      res.status(HttpStatusCode.Ok).json(profileData);
    } catch (err) {
      next(err);
    }
  }

  async getDelegateManagerList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: DelegateManagerListDataToDbDto = req.body;

      const profileList: DelegateManagerListResponseDto =
        await this.profileService.getDelegateManagerList(data);
      res.json(profileList);
    } catch (error) {
      next(error);
    }
  }

  async createChildProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy = req.docUser!.profileId;
    const updatedBy = req.docUser!.profileId;
    const authToken = req.headers.authorization as string;
    try {
      const data: CreateChildProfileRequestDto = req.body;
      const childProfile: CreateChildProfileReponseDto =
        await this.profileService.createChildProfile(
          {
            ...data,
            createdBy,
            updatedBy,
          },
          authToken,
        );
      res.json(childProfile);
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const updatedBy: number = req.docUser!.profileId;
    const authHeader: string = req.headers.authorization as string;
    try {
      const data: UpdateMyProfileBodyDto = req.body;
      const results: UpdatedProfile = await this.profileService.updateMyProfile(
        {
          ...data,
          updatedBy,
          id: updatedBy,
        },
        authHeader,
      );
      res.status(HttpStatusCode.Ok).json({ results });
    } catch (error) {
      next(error);
    }
  }

  async listbrandcolor(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const brandcolors: ListBrandColorResponse =
        await this.profileService.getBrandcolor();
      res.status(HttpStatusCode.Ok).json({ brandcolors });
    } catch (error) {
      next(error);
    }
  }

  async editBulkProfile(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: EditBulkProfileBodyDto = req.body;
      const result: EditBuilkProfileResponseDto =
        await this.profileService.editBulkProfile(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listthemes(_req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const themes: ListThemeResponse = await this.profileService.gettheme();
      res.json({ themes });
    } catch (error) {
      next(error);
    }
  }

  async getLoginDetails(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      const type: string | undefined =
        typeof req.query.type === 'string' ? req.query.type : undefined;

      const loginDetails: LoginDetails =
        await this.profileService.getLoginDetails(Number(id), type);
      res.status(HttpStatusCode.Ok).json({ loginDetails });
    } catch (error) {
      next(error);
    }
  }

  async viewMyProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const userId = req.docUser!.profileId;
    try {
      const results: FormattedProfileData[] =
        await this.profileService.viewMyProfile(userId);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async ImportUserProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const file = req.file?.buffer;
      const fileType = req.file?.mimetype;
      const fileName: string =
        req.file && req.file.originalname ? req.file.originalname : '';
      const authHeader = req.headers.authorization as string;

      const { relayChangesField } = req.body;
      const relayChangesFieldArray = relayChangesField
        ? relayChangesField.split(',').map((field) => field.trim())
        : [];

      if (!file || !fileType) {
        res.status(400).json({ error: 'File and content type are required.' });
        return;
      }
      const ImportUserProfileHeader: string[] = [
        'firstName',
        'lastName',
        'preferredName',
        'email',
        'phoneNumber',
        'userName',
        'delegateUser',
        'functionalArea',
        'role',
        'permission',
        'permissionGroup',
        'timeZone',
        'locale',
      ];
      const validatedData: ImportUserProfileDto[] = processFile(
        file,
        fileType,
        ImportUserProfileHeader,
      );
      const updatedBy = req.docUser!.profileId;
      const ImportUserProfile: ImportUserProfileResponseData =
        await this.profileService.ImportUserProfile(
          validatedData,
          authHeader,
          updatedBy,
          fileName,
          relayChangesFieldArray,
        );
      res.status(200).json({
        message: 'File processed successfully.',
        data: ImportUserProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  async createHcpProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy: number = req.docUser!.profileId;
    try {
      const data: CreateHcpProfileDto = req.body;
      const hcpProfile: HcpProfileResponse =
        await this.profileService.createHcpProfile({ ...data, createdBy });
        const responseMessage: string =
        data?.cloneId && data?.type === COMMON.CLONE
          ? PROFILE_MESSAGES.PROFILE_CLONED_SUCCESSFULLY
          : MESSAGES.USER_CREATED_SUCCESSFULLY;
      res
        .status(HttpStatusCode.Created)
        .json({ message: responseMessage, hcpProfile });
    } catch (error) {
      next(error);
    }
  }

  async createProfileRolePermissionAlignment(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: CreateProfileRolePermissionAlignmentDto = req.body;
      await this.profileService.createProfileRolePermissionAlignment({
        ...data,
      });

      res
        .status(HttpStatusCode.Created)
        .json({ message: MESSAGES.PROFILEROLEPERMISSIONALIGNMENT });
    } catch (error) {
      next(error);
    }
  }

  async editHcpProfile(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    try {
      const data: EditHcpProfileDto = req.body;
      const hcpProfile: EditHcpProfileResponse =
        await this.profileService.editHcpProfile({ ...data, createdBy });
      res
        .status(HttpStatusCode.Ok)
        .json({ message: MESSAGES.PROFILE_UPDATE_SUCCESSFULLY, hcpProfile });
    } catch (error) {
      next(error);
    }
  }

  async addAddressAndEmail(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { body } = req;
      const createdBy: number = req.docUser!.profileId;
      const updatedBy: number = req.docUser!.profileId;

      const data: AddAddressAndEmailRequestDto = {
        createdBy,
        updatedBy,
        ...body,
      };
      const profileAddressDetails =
        await this.profileService.addAddressAndEmail(data);
      res.json({
        message: PROFILE_MESSAGES.PROFILE_ADDRESS_SUCCESSFULLY_ADDED,
        data: profileAddressDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  async editProfileRolePermissionAlignment(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: EditProfileRolePermissionAlignmentDto = req.body;
      await this.profileService.updateProfileRolePermissionAlignment({
        ...data,
      });

      res
        .status(HttpStatusCode.Created)
        .json({ message: MESSAGES.UPDATEPROFILEROLEPERMISSIONALIGNMENT });
    } catch (error) {
      next(error);
    }
  }

  async addHcpBioProfessionCredentials(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: CreateHcpBioProfessionRequestDTO = req.body;

      const responseData: HcpBioProfessionresponseDto =
        await this.profileService.addHcpBioProfessionpCredentials({
          ...data,
          createdBy,
          updatedBy,
        });

      res.status(HttpStatusCode.Created).json({
        message: PROFILE_MESSAGES.PROFILE_HCP_CREDENTIALS_CREATE,
        data: responseData,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateHcpBioProfessionCredentials(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {

      const { body } = req;
      const updatedBy: number = req.docUser!.profileId;
      const createdBy: number = req.docUser!.profileId;

      const data: UpdateHcpCredentialsRequestDto = {
        createdBy,
        updatedBy, 
        profileId: parseInt(req.params.id,10), 
        ...body}
      
      const hcpBioProfession: HcpBioProfessionresponseDto =
      await this.profileService.updateHcpBioProfessionCredentials({
        ...data,
      });

      res
        .status(HttpStatusCode.Created)
        .json({ message: PROFILE_MESSAGES.PROFILE_HCP_CREDENTIALS_UPDATE,
          data: hcpBioProfession,
        });
    } catch (error) {
      next(error);
    }
  }

  async addCommunicationPreference(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const createdBy: number = req.docUser!.profileId;
      const data: CommunicationPreferencesRequestDto = req.body;

      const addCommunicationPreferences: CommunicationPreferencesResponseDto =
        await this.profileService.addCommunicationPreference({
          ...data,
          createdBy,
        });

      res.status(HttpStatusCode.Ok).json({
        message: PROFILE_MESSAGES.COMMUNICATION_PREFERENCES_ADDED_SUCCESSFULLY,
        data: addCommunicationPreferences,
      });
    } catch (error) {
      next(error);
    }
  }

  async UpdateCommunicationPreferences(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const updatedBy: number = req.docUser!.profileId;
      const data: CommunicationPreferencesRequestDto = req.body;
      const addCommunicationPreferences: CommunicationPreferencesResponseDto =
        await this.profileService.UpdateCommunicationPreferences(
          data,
          parseInt(req.params.id, 10),
          updatedBy,
        );

      res.status(HttpStatusCode.Ok).json({
        message:
          PROFILE_MESSAGES.COMMUNICATION_PREFERENCES_UPDATED_SUCCESSFULLY,
        data: addCommunicationPreferences,
      });
    } catch (error) {
      next(error);
    }
  }

  async editAndAddAddressAndEmail(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { body } = req;
      const profileId = parseInt(req.params.profileId, 10);
      const updatedBy: number = req.docUser!.profileId;
      const createdBy: number = req.docUser!.profileId;
      const data: EditAndAddAddressAndEmailRequestDto = {
        profileId,
        updatedBy,
        createdBy,
        ...body,
      };
      await this.profileService.editAndAddAddressAndEmail(data);
      res.json({
        message: PROFILE_MESSAGES.PROFILE_ADDRESS_SUCCESSFULLY_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  }

  async archiveProfile(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ArchiveProfileRequestDto = req.body;
      const archiveResponse: ArchiveProfileResponseDto =
        await this.profileService.archiveProfile(data);
      res
        .status(archiveResponse.status)
        .json({ message: archiveResponse.message });
    } catch (error) {
      next(error);
    }
  }
  async getProfileName(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: GetProfileNameReq = req.body;
      const profileList: GetProfileNameRes =
        await this.profileService.getProfileName(data);
      res.status(HttpStatusCode.Ok).json({ profileList });
    } catch (error) {
      next(error);
    }
  }
}
