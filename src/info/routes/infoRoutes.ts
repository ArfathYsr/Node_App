import { NextFunction, Router, Response } from 'express';
import { CustomRequest } from '../../types/express';
import container from '../../dependencyManager/inversify.config';
import InfoController from '../controllers/infoController';
import TYPES from '../../dependencyManager/types';
import { AuditHistoryRequestSchema } from '../schemas/infoSchema';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import ProfileController from '../../profile/controllers/profileController';
import ClientController from 'src/client/controllers/clientController';

const router = Router();
const infoController = container.get<InfoController>(TYPES.InfoController);
const profileController = container.get<ProfileController>(TYPES.ProfileController);
const clientController = container.get<ClientController>(TYPES.ClientController)

router.get('/countries', (req, res) => infoController.getCountries(req, res));
router.get('/version', (req, res) => infoController.getVersion(req, res));
router.post(
  '/audit-history',
  validatorMiddleware(AuditHistoryRequestSchema),
  (req, res, next) => infoController.getAuditHistory(req, res, next),
);
router.get('/timezone', (req, res) => infoController.getTimezone(req, res));

router.get('/locale', (req, res) => infoController.getLocale(req, res));
router.post('/getProfile', (req: CustomRequest, res: Response, next: NextFunction) =>
  profileController.getProfileName(req, res, next),
);
router.post('/getClient', (req: CustomRequest, res: Response, next: NextFunction) =>
  clientController.getClientName(req, res, next),
)
export default router;
