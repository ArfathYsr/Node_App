import { Router } from 'express';
import container from '../../dependencyManager/inversify.config';
import AuthController from '../controllers/authController';
import TYPES from '../../dependencyManager/types';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.get('/home', (req, res) => authController.getUserData(req, res));
router.get('/logout', authController.logout);

export default router;
