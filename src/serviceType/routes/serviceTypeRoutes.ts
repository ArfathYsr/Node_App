import { NextFunction, Router, Request, Response } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import ServiceTypeController from '../controllers/serviceTypeController';
import {
  AddServiceTypesRequestSchema,
  ArchiveServiceTypeRequestSchema,
  EditServiceTypesRequestSchema,
  ServiceTypeListSchema,
  ServiceTypeListShortSchema,
  ViewServiceTypesRequestSchema,
} from '../schemas/serviceTypeSchema';

const router = Router();
const serviceTypeController = container.get<ServiceTypeController>(
  TYPES.ServiceTypeController,
);

router.post(
  '/',
  validatorMiddleware(AddServiceTypesRequestSchema),
  (req, res, next) => serviceTypeController.addServiceTypes(req, res, next),
);

router.put(
  '/:id',
  validatorMiddleware(EditServiceTypesRequestSchema),
  (req, res, next) => serviceTypeController.editServiceTypes(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(ServiceTypeListSchema),
  (req: Request, res: Response, next: NextFunction) =>
    serviceTypeController.serviceTypeList(req, res, next),
);

router.post(
  '/list/short',
  validatorMiddleware(ServiceTypeListShortSchema),
  (req: Request, res: Response, next: NextFunction) =>
    serviceTypeController.serviceTypeListShort(req, res, next),
);

router.get(
  '/:id',
  validatorMiddleware(ViewServiceTypesRequestSchema),
  (req, res, next) => serviceTypeController.viewServiceType(req, res, next),
);

router.post(
  '/archive/:id',
  validatorMiddleware(ArchiveServiceTypeRequestSchema),
  (req, res, next) => serviceTypeController.archiveServiceType(req, res, next),
);

router.post(
  '/unarchive/:id',
  validatorMiddleware(ArchiveServiceTypeRequestSchema),
  (req, res, next) => serviceTypeController.unArchiveServiceType(req, res, next),
);

export default router;
