import { NextFunction, Router, Request, Response } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import {
  AddVendorRequestSchema,
  GetVendorMeetingRoomsRequestSchema,
  GetVendorRequestSchema,
  VendorListRequestSchema,
  VendorMatchListRequestSchema,
} from '../schemas/vendorSchema';
import VendorController from '../controllers/vendorController';

const router = Router();
const vendorController = container.get<VendorController>(
  TYPES.VendorController,
);

router.post(
  '/',
  validatorMiddleware(AddVendorRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorController.createVendor(req, res, next),
);

router.get(
  '/:id',
  validatorMiddleware(GetVendorRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorController.getVendorById(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(VendorListRequestSchema),
  (req, res, next) => vendorController.getVendorList(req, res, next),
);
router.post(
  '/potential-match-list',
  validatorMiddleware(VendorMatchListRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorController.viewVendorMatchList(req, res, next),
);

router.post(
  '/vendor-meeting-rooms/list', 
  validatorMiddleware(GetVendorMeetingRoomsRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorController.getVendorRoomList(req, res, next),
);
export default router;
