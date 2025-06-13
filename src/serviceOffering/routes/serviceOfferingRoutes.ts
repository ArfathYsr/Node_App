import { NextFunction, Router, Request, Response } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import {
    createServiceOfferingRequestSchema,
    ServiceTypeWorkItemRequestSchema,
    ServiceOfferingListRequestSchema,
    EditServiceOfferingRequestSchema,
    BulkEditServiceOfferingRequestSchema,
    ArchiveOrUnarchiveServiceOfferingSchema,
    ListWorkItemRequest,
    ViewServiceOfferingRequestSchema,
} from '../schemas/serviceofferingSchema';
import ServiceOfferingController from '../controllers/serviceOfferingController';

const router = Router();
const serviceOfferingController = container.get<ServiceOfferingController>(
  TYPES.ServiceOfferingController,
);

router.post(
  '/',
  validatorMiddleware(createServiceOfferingRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    serviceOfferingController.createServiceOffering(req, res, next),
);

router.put(
  '/:id',
  validatorMiddleware(EditServiceOfferingRequestSchema),
  (req, res, next) => serviceOfferingController.editServiceOffering(req, res, next),
);

router.post('/workItem/list',
  validatorMiddleware(ListWorkItemRequest),
(req: Request, res: Response, next: NextFunction) => 
  serviceOfferingController.listWorkItem(req, res, next),
);


router.post(
  '/serviceTypeWorkItem',
  validatorMiddleware(ServiceTypeWorkItemRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    serviceOfferingController.serviceTypeWorkItem(req, res, next),
);


router.post(
  '/archive',
  validatorMiddleware(ArchiveOrUnarchiveServiceOfferingSchema),
  (req, res, next) =>
    serviceOfferingController.archiveServiceOffering(req, res, next),
);

router.post(
  '/unarchive',
  validatorMiddleware(ArchiveOrUnarchiveServiceOfferingSchema),
  (req, res, next) =>
    serviceOfferingController.unarchiveServiceOffering(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(ServiceOfferingListRequestSchema),
  (req, res, next) => serviceOfferingController.serviceOfferingList(req, res, next),
);

router.post(
  '/bulk-edit',
  validatorMiddleware(BulkEditServiceOfferingRequestSchema),
  (req, res, next) => serviceOfferingController.bulkEditServiceOffering(req, res, next),
);

router.get(
  '/:id',
  validatorMiddleware(ViewServiceOfferingRequestSchema),
  (req, res, next) => serviceOfferingController.viewServiceOffering(req, res, next),
);
export default router;
