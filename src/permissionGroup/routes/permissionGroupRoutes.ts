import { Router } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import PermissionGroupController from '../controllers/permissionGroupController';
import {
  CreatePermissionGroupSchema,
  UpdatePermissionGroupSchema,
  ViewPermissionGroupSchema,
  ViewPermissionGroupListSchema,
  ViewShortPermissionGroupsSchema,
  PermissionGroupDeleteRequestSchema,
  ArchivePermissionGroupRequestSchema,
} from '../schemas/permissionGroupSchema';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';
import { AvailableRoles } from '../../utils/constants';

const router = Router();
const permissionGroupController = container.get<PermissionGroupController>(
  TYPES.PermissionGroupController,
);

router.post(
  '/',
  validatorMiddleware(CreatePermissionGroupSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req, res, next) =>
    permissionGroupController.createPermissionGroup(req, res, next),
);

router.put(
  '/:id',
  validatorMiddleware(UpdatePermissionGroupSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req, res, next) =>
    permissionGroupController.updatePermissionGroup(req, res, next),
);

router.get(
  '/:id',
  validatorMiddleware(ViewPermissionGroupSchema),
  (req, res, next) =>
    permissionGroupController.viewPermissionGroup(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(ViewPermissionGroupListSchema),
  (req, res, next) =>
    permissionGroupController.viewPermissionGroupList(req, res, next),
);
router.post(
  '/list/short',
  validatorMiddleware(ViewShortPermissionGroupsSchema),
  (req, res, next) =>
    permissionGroupController.getShortPermissionGroups(req, res, next),
);

router.delete(
  '/',
  validatorMiddleware(PermissionGroupDeleteRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req, res, next) =>
    permissionGroupController.deletePermissionGroups(req, res, next),
);

router.post(
  '/archive',
  validatorMiddleware(ArchivePermissionGroupRequestSchema),
  (req, res, next) =>
    permissionGroupController.archivePermissionGroup(req, res, next),
);

export default router;
