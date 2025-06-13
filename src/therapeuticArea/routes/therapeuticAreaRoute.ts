import { Router, Request, Response, NextFunction } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import TherapeuticAreaController from '../controllers/therapeuticAreaController';
import {
  CreateTherapeuticAreaRequestSchema,
  EditTherapeuticAreaRequestSchema,
  TherapeuticAreaDeleteRequestSchema,
  ViewTherapeuticAreaSchemaByIdRequestSchema,
} from '../schemas/therapeuticAreaSchema';

const router = Router();
const therapeuticAreaController = container.get<TherapeuticAreaController>(
  TYPES.TherapeuticAreaController,
);

router.post(
  '/',
  validatorMiddleware(CreateTherapeuticAreaRequestSchema),
  (req, res, next) =>
    therapeuticAreaController.createTherapeuticArea(req, res, next),
);

router.get('/list-therapeutic-area', (req, res, next) =>
  therapeuticAreaController.listTheraputicArea(req, res, next),
);

router.get(
  '/:id',
  validatorMiddleware(ViewTherapeuticAreaSchemaByIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    therapeuticAreaController.getTherapeuticArea(req, res, next),
);

router.put(
  '/:id',
  validatorMiddleware(EditTherapeuticAreaRequestSchema),
  (req: Request, res: Response, next: NextFunction) =>
    therapeuticAreaController.editTherapeuticArea(req, res, next),
);

router.delete(
  '/',
  validatorMiddleware(TherapeuticAreaDeleteRequestSchema),
  (req, res, next) =>
    therapeuticAreaController.deleteTherapeuticArea(req, res, next),
);

export default router;
