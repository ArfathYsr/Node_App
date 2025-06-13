import { NextFunction, Router, Response } from 'express';
import multer from 'multer';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import ProfileController from '../controllers/profileController';
import {
  CreateProfileRequestSchema,
  ProfileListRequestSchema,
  GetProfileRequestSchema,
  UpdateProfileRequestSchema,
  DelegateManagerProfileListRequestSchema,
  CreateChildProfileRequestSchema,
  UpdateMyProfileRequestSchema,
  BulkProfileEditRequestSchema,
  LoginRequestSchema,
  ViewMyProfileRequestSchema,
  ImportUserProfileRequestSchema,
  CreateHcpProfileRequestSchema,
  EditProfileRolePermissionAlignmentRequestSchema,
  ProfileRolePermissionAlignmentRequestSchema,
  EditHcpProfileRequestSchema,
  AddProfileAddressAndEmailRequestSchema,
  EditAndAddProfileAddressAndEmailRequestSchema,
  EditHcpCredentialsRequestSchema,
  UpdateCommunicationPreferencesRequestSchema,
  CommunicationPreferencesRequestSchema,
  ArchiveProfileRequestSchema,
  CreateHcpBioProfessionRequestSchema,
} from '../schemas/profileSchema';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import { CustomRequest } from '../../types/express';

const upload = multer();
const router = Router();
const profileController = container.get<ProfileController>(
  TYPES.ProfileController,
);

router.get('/list-brandcolor', (req, res, next) =>
  profileController.listbrandcolor(req, res, next),
);

router.get('/list-theme', (req, res, next) =>
  profileController.listthemes(req, res, next),
);

router.post(
  '/',
  validatorMiddleware(CreateProfileRequestSchema),
  (req, res, next) => profileController.createProfile(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(ProfileListRequestSchema),
  (req, res, next) => profileController.getProfileList(req, res, next),
);
router.put(
  '/my-profile',
  validatorMiddleware(UpdateMyProfileRequestSchema),
  (req, res, next) => profileController.updateMyProfile(req, res, next),
);
router.put(
  '/:id',
  validatorMiddleware(UpdateProfileRequestSchema),
  (req, res, next) => profileController.updateProfile(req, res, next),
);

router.get(
  '/login-details',
  validatorMiddleware(LoginRequestSchema),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    profileController.getLoginDetails(req, res, next),
);
router.get(
  '/my-profile',
  validatorMiddleware(ViewMyProfileRequestSchema),
  (req, res, next) => profileController.viewMyProfile(req, res, next),
);
router.get(
  '/:id',
  validatorMiddleware(GetProfileRequestSchema),
  (req, res, next) => profileController.getProfileById(req, res, next),
);

router.post(
  '/delegate-managers',
  validatorMiddleware(DelegateManagerProfileListRequestSchema),
  (req, res, next) => profileController.getDelegateManagerList(req, res, next),
);

router.post(
  '/add_child_profile',
  validatorMiddleware(CreateChildProfileRequestSchema),
  (req, res, next) => profileController.createChildProfile(req, res, next),
);

router.post(
  '/profile-bulk-edit',
  validatorMiddleware(BulkProfileEditRequestSchema),
  (req, res, next) => profileController.editBulkProfile(req, res, next),
);

// router.post('/import-user-profile', upload.single('file'),validatorMiddleware(ImportUserProfileRequestSchema), (req, res, next) =>
//   profileController.ImportUserProfile(req, res, next),
// );

router.post(
  '/import-user-profile',
  upload.single('file'),
  validatorMiddleware(ImportUserProfileRequestSchema),
  (req, res, next) => profileController.ImportUserProfile(req, res, next),
);

router.post(
  '/add_name_contact',
  validatorMiddleware(CreateHcpProfileRequestSchema),
  (req, res, next) => profileController.createHcpProfile(req, res, next),
);

router.post(
  '/add_role_permissions',
  validatorMiddleware(ProfileRolePermissionAlignmentRequestSchema),
  (req, res, next) =>
    profileController.createProfileRolePermissionAlignment(req, res, next),
);

router.post(
  '/edit_name_contact',
  validatorMiddleware(EditHcpProfileRequestSchema),
  (req, res, next) => profileController.editHcpProfile(req, res, next),
);

router.post(
  '/edit_role_permissions',
  validatorMiddleware(EditProfileRolePermissionAlignmentRequestSchema),
  (req, res, next) =>
    profileController.editProfileRolePermissionAlignment(req, res, next),
);

router.post(
  '/add_addresses',
  validatorMiddleware(AddProfileAddressAndEmailRequestSchema),
  (req, res, next) => profileController.addAddressAndEmail(req, res, next),
);

router.post(
  '/communication_preferences',
  validatorMiddleware(CommunicationPreferencesRequestSchema),
  (req, res, next) =>
    profileController.addCommunicationPreference(req, res, next),
);

router.put(
  '/communication-preferences/:id',
  validatorMiddleware(UpdateCommunicationPreferencesRequestSchema),
  (req, res, next) =>
    profileController.UpdateCommunicationPreferences(req, res, next),
);

router.post(
  '/add_hcp_credentials',
  validatorMiddleware(CreateHcpBioProfessionRequestSchema),
  (req, res, next) =>
    profileController.addHcpBioProfessionCredentials(req, res, next),
);

router.put(
  '/edit_hcp_credentials/:id',
  validatorMiddleware(EditHcpCredentialsRequestSchema),
  (req, res, next) =>
    profileController.updateHcpBioProfessionCredentials(req, res, next),
);

router.put(
  '/edit_addresses/:profileId',
  validatorMiddleware(EditAndAddProfileAddressAndEmailRequestSchema),
  (req, res, next) =>
    profileController.editAndAddAddressAndEmail(req, res, next),
);

router.post(
  '/archive',
  validatorMiddleware(ArchiveProfileRequestSchema),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    profileController.archiveProfile(req, res, next),
);

export default router;
