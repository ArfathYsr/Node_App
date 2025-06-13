import { NextFunction, Router, Request, Response } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import { CreateAddVenueChecklistRequestSchema, GetVendorVenueCheckListDetailsRequestSchema } from '../schemas/vendorVenueChecklistSchema';
import VendorVenueChecklistController from '../controllers/vendorVenueChecklistController';

const router = Router();
const vendorVenueChecklistController =
  container.get<VendorVenueChecklistController>(
    TYPES.VendorVenueChecklistController,
  );

router.post(
  '/',
  validatorMiddleware(CreateAddVenueChecklistRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorVenueChecklistController.createVenueCheckList(req, res, next),
);

router.get(
  '/:vendorId',
  validatorMiddleware(GetVendorVenueCheckListDetailsRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorVenueChecklistController.getVendorVenueCheckListDetails(req, res, next),
);

export default router;
