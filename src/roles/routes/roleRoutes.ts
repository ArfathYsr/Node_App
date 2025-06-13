import { Router, Request, Response, NextFunction } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import {
  CreateRoleRequestSchema,
  RoleListRequestSchema,
  ViewRoleByIdRequestSchema,
  EditRoleRequestSchema,
  RoleDeleteRequestSchema,
  RolePermissionGroupListRequestSchema,
  RoleArchiveSchema,
  RoleShortListRequestSchema,
  GetRolePermissionSchema,
  ViewPermissionGroupSchema,
  AlignRolePermissionGroupsSchema,
} from '../schemas/roleSchema';
import RoleController from '../controllers/roleController';
import roleMiddleware from '../../middlewares/roleMiddleware';
import { AvailableRoles } from '../../utils/constants';

const router = Router();
const roleController = container.get<RoleController>(TYPES.RoleController);

router.post(
  '/',
  validatorMiddleware(CreateRoleRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.createRole(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(RoleListRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRoleList(req, res, next),
);
router.post(
  '/list/short',
  validatorMiddleware(RoleShortListRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRoleShortList(req, res, next),
);
router.get(
  '/role_category_criteria',
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRoleCategories(req, res, next),
);
router.put(
  '/role_category_criteria_alignment/:id',
  (req: Request, res: Response, next: NextFunction) =>
    roleController.editRoleCategoryCriteriaAlignment(req, res, next),
);
router.get(
  '/:id',
  validatorMiddleware(ViewRoleByIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRole(req, res, next),
);

router.put(
  '/:id',
  validatorMiddleware(EditRoleRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.editRole(req, res, next),
);

router.post(
  '/permission-groups',
  validatorMiddleware(RolePermissionGroupListRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRolePermissionGroupList(req, res, next),
);

router.post(
  '/permission-groups/unaligned',
  validatorMiddleware(RolePermissionGroupListRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRolePermissionGroupListUnaligned(req, res, next),
);

router.delete(
  '/',
  validatorMiddleware(RoleDeleteRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.deleteRole(req, res, next),
);

router.post(
  '/archive',
  validatorMiddleware(RoleArchiveSchema),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.archiveRole(req, res, next),
);
router.get(
  '/:id/roles-permission',
  validatorMiddleware(GetRolePermissionSchema),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRolePermission(req, res, next),
);

router.get(
  '/:id/roles-permission-group',
  validatorMiddleware(ViewPermissionGroupSchema),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getPermissionGroupRoles(req, res, next),
);

router.post(
  '/align-permission-group',
  validatorMiddleware(AlignRolePermissionGroupsSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.alignRolePermissionGroup(req, res, next),
);

router.get(
  '/:id/role-additional-data',
  validatorMiddleware(ViewPermissionGroupSchema),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.getRoleAdditionalData(req, res, next),
);
export default router;
