import { Router, Request, Response, NextFunction } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import FunctionalAreaController from '../controllers/functionalAreaController';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import {
  CreateFunctionalAreaRequestSchema,
  GetFunctionalAreaRequestSchema,
  FunctionalAreaListRequestSchema,
  EditFunctionalAreaRequestSchema,
  FunctionalAreaDeleteRequestSchema,
  FunctionalAreaRoleListRequestSchema,
  FunctionlAreaArchiveSchema,
  ViewShortFunctionalAreasSchema,
} from '../schemas/functionalAreaSchema';

const router = Router();
const functionalAreaController = container.get<FunctionalAreaController>(
  TYPES.FunctionalAreaController,
);

router.post(
  '/',
  validatorMiddleware(CreateFunctionalAreaRequestSchema),
  (req, res, next) =>
    functionalAreaController.createFunctionalArea(req, res, next),
);

router.get(
  '/:id',
  validatorMiddleware(GetFunctionalAreaRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    functionalAreaController.getFunctionalArea(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(FunctionalAreaListRequestSchema),
  (req, res, next) =>
    functionalAreaController.getFunctionalAreaList(req, res, next),
);

router.put(
  '/:id',
  validatorMiddleware(EditFunctionalAreaRequestSchema),
  (req, res, next) =>
    functionalAreaController.editFunctionalArea(req, res, next),
);

router.delete(
  '/',
  validatorMiddleware(FunctionalAreaDeleteRequestSchema),
  (req, res, next) =>
    functionalAreaController.deleteFunctionalAreas(req, res, next),
);

router.post(
  '/rolesList',
  validatorMiddleware(FunctionalAreaRoleListRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    functionalAreaController.getFunctionalAreaRoleList(req, res, next),
);

router.post(
  '/archive',
  validatorMiddleware(FunctionlAreaArchiveSchema),
  (req, res, next) =>
    functionalAreaController.archiveFunctionalArea(req, res, next),
);

router.post(
  '/list/short',
  validatorMiddleware(ViewShortFunctionalAreasSchema),
  (req, res, next) =>
    functionalAreaController.getShortFunctionalAreas(req, res, next),
);
export default router;
