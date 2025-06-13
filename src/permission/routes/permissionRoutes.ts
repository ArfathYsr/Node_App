import { NextFunction, Router, Request, Response } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import {
  EditPermissionSchema,
  AddPermissionRequestSchema,
  ListPermissionSchema,
  ViewPermissionSchema,
  PermissionDeleteRequestSchema,
  ViewShortPermissionsSchema,
  ArchivePermissionRequestSchema,
} from '../schemas/permissionSchema';
import PermissionController from '../controllers/permissionController';
import roleMiddleware from '../../middlewares/roleMiddleware';
import { AvailableRoles } from '../../utils/constants';

const router = Router();
const permissionController = container.get<PermissionController>(
  TYPES.PermissionController,
);
router.put(
  '/:id',
  validatorMiddleware(EditPermissionSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    permissionController.editPermission(req, res, next),
);
router.get(
  '/:id',
  validatorMiddleware(ViewPermissionSchema),
  (req: Request, res: Response, next: NextFunction) =>
    permissionController.viewPermission(req, res, next),
);
router.post(
  '/list',
  validatorMiddleware(ListPermissionSchema),
  (req: Request, res: Response, next: NextFunction) =>
    permissionController.listPermissions(req, res, next),
);
router.post(
  '/',
  validatorMiddleware(AddPermissionRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    permissionController.createPermission(req, res, next),
);
router.delete(
  '/',
  validatorMiddleware(PermissionDeleteRequestSchema),
  roleMiddleware([AvailableRoles.ADMIN, AvailableRoles.SUPER_ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    permissionController.deletePermissions(req, res, next),
);
router.post(
  '/list/short',
  validatorMiddleware(ViewShortPermissionsSchema),
  (req: Request, res: Response, next: NextFunction) =>
    permissionController.getShortPermissions(req, res, next),
);

router.get('/list/menu', (req: Request, res: Response, next: NextFunction) =>
  permissionController.listMenu(req, res, next),
);

router.post(
  '/archive',
  validatorMiddleware(ArchivePermissionRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    permissionController.archivePermission(req, res, next),
);

export default router;
