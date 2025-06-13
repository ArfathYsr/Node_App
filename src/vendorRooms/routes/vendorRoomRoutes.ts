import { NextFunction, Router, Request, Response } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import { AddVendorRoomRequestSchema,GetRoomDetailsRequestSchema } from '../schemas/vendorRoomSchema';
import VendorRoomController from '../controllers/vendorRoomController';

const router = Router();
const vendorRoomController = container.get<VendorRoomController>(
  TYPES.VendorRoomController,
);
router.post(
  '/',
  validatorMiddleware(AddVendorRoomRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorRoomController.addRoomInfoAndQuestionnair(req, res, next),
);

router.get('/list', (req: Request, res: Response, next: NextFunction) =>
  vendorRoomController.vendorRoomList(req, res, next),
);

router.get(
  '/:id',
  validatorMiddleware(GetRoomDetailsRequestSchema),
  (req, res, next) => vendorRoomController.getRoomDetailsById(req, res, next),
);

export default router;
