import { Router } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import ClientController from '../controllers/clientController';
import {
  CreateClientRequestSchema,
  ChildClientsCreationRequestSchema,
  ClientListRequestSchema,
  EditClientRequestSchema,
  EditChildClientRequestSchema,
  ClientByIdRequestSchema,
  ParentClientListRequestSchema,
  DeleteClientsRequestSchema,
  ClientShortListRequestSchema,
} from '../schemas/clientSchema';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

const router = Router();
const clientController = container.get<ClientController>(
  TYPES.ClientController,
);

router.post(
  '/child-clients',
  validatorMiddleware(ChildClientsCreationRequestSchema),
  (req, res, next) => clientController.createChildClients(req, res, next),
);
router.post(
  '/',
  validatorMiddleware(CreateClientRequestSchema),
  (req, res, next) => clientController.createClient(req, res, next),
);

router.post(
  '/list',
  validatorMiddleware(ClientListRequestSchema),
  (req, res, next) => clientController.getClientList(req, res, next),
);

router.post(
  '/list/short',
  validatorMiddleware(ClientShortListRequestSchema),
  (req, res, next) => clientController.getShortClientList(req, res, next),
);

router.get('/statuses', (req, res) =>
  clientController.getClientStatuses(req, res),
);

router.get(
  '/:id',
  validatorMiddleware(ClientByIdRequestSchema),
  (req, res, next) => clientController.getClient(req, res, next),
);

router.put(
  '/:id',
  validatorMiddleware(EditClientRequestSchema),
  (req, res, next) => clientController.editClient(req, res, next),
);

router.put(
  '/child-clients/:id',
  validatorMiddleware(EditChildClientRequestSchema),
  (req, res, next) => clientController.editChildClient(req, res, next),
);

router.post(
  '/parents/list',
  validatorMiddleware(ParentClientListRequestSchema),
  (req, res, next) => clientController.getParentClientList(req, res, next),
);

router.delete(
  '/',
  validatorMiddleware(DeleteClientsRequestSchema),
  (req, res, next) => clientController.deleteClients(req, res, next),
);
export default router;
