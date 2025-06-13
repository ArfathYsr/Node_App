import { NextFunction, Router, Request, Response } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import OrgHierarchyController from '../controllers/orgHierarchyController';
import { ListOrgHierarchySchema } from '../schemas/orgHierarchySchema';
const router = Router();

const orgHierarchyController = container.get<OrgHierarchyController>(
    TYPES.OrgHierarchyController,
  );

router.post(
  '/list',
  validatorMiddleware(ListOrgHierarchySchema),
  (req: Request, res: Response, next: NextFunction) =>
    orgHierarchyController.listOrgHierarchy(req, res, next),
);

router.post(
  '/clone',
  (req: Request, res: Response, next: NextFunction) =>
   orgHierarchyController.cloneOrgHierarchyData(req, res, next),
);

export default router;