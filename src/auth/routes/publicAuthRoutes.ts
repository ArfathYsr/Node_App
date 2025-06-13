import { Router, Request, Response, NextFunction } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import PublicAuthController from '../controllers/publicAuthController';

const router = Router();
const publicAuthController = container.get<PublicAuthController>(
  TYPES.PublicAuthController,
);

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  publicAuthController.authenticate(req, res, next),
);

router.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  return publicAuthController.callbackAuthenticate(req, res, next);
});

export default router;
