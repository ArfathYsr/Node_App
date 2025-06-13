import express, { Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { createServer, Server } from 'http';
import config from 'config';
import authRoutes from './auth/routes/authRoutes';
import corsMiddleware from './middlewares/corsMiddleware';
import morganMiddleware from './middlewares/morganMiddleware';
import AuthHandler from './libs/authHandler';
import logger from './libs/logger';
import { generateOpenAPIDocument } from './openapi';
import errorHandler from './middlewares/errorHandlerMiddlware';
import container from './dependencyManager/inversify.config';
import TYPES from './dependencyManager/types';
import sessionMiddleware from './middlewares/sessionMiddleware';
import authMiddleware from './middlewares/authMiddleware';
import publicAuthRoutes from './auth/routes/publicAuthRoutes';
import infoRoutes from './info/routes/infoRoutes';
import clientRoutes from './client/routes/clientRoutes';
import jsonBodyMiddlware from './middlewares/jsonBodyMiddlware';
import functionalAreaRoutes from './functionalArea/routes/functionalAreaRoutes';
import permissionGroupRoutes from './permissionGroup/routes/permissionGroupRoutes';
import permissionRoutes from './permission/routes/permissionRoutes';
import profileRouter from './profile/routes/profileRoutes';
import roleRoutes from './roles/routes/roleRoutes';
import therapeuticAreaRoutes from './therapeuticArea/routes/therapeuticAreaRoute';
import CronService from './utils/cronService';
import commonRoutes from './common/routes/commonRoutes';
import lookupRoutes from './lookupData/routes/lookupDataRoutes';
import vendorRoutes from './vendor/routes/vendorRoutes';
import vendorVenueChecklistRoutes from './vendorVenueChecklist/routes/vendorVenueChecklistRoutes';
import vendorRoomRoutes from './vendorRooms/routes/vendorRoomRoutes';
import serviceOfferingRoutes from './serviceOffering/routes/serviceOfferingRoutes';
import serviceTypeRoutes from './serviceType/routes/serviceTypeRoutes';
import orgHierarchyRoutes from './orgHierarchy/routes/orgHierarchyRoutes';

class App {
  private static app: Application;

  private static authHandler: AuthHandler;

  private static server?: Server;

  private static setupMiddleware(authHandler: AuthHandler) {
    this.app.use(helmet());
    this.app.use(jsonBodyMiddlware);
    this.app.use(morganMiddleware());
    this.app.use(sessionMiddleware);
    this.app.use(corsMiddleware);
    this.app.use(authHandler.registerMiddleware());
  }

  private static async setupRoutes() {
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(
        generateOpenAPIDocument(),
        config.get<object>('openApi.swagger'),
      ),
    );
    this.app.use('/api', infoRoutes);
    this.app.use('/api/v1/auth', publicAuthRoutes);
    this.app.use(authMiddleware);

    this.app.use('/api/v1/clients', clientRoutes);
    this.app.use('/api/v1/profiles', profileRouter);
    this.app.use('/api/v1/auth', authRoutes);
    this.app.use('/api/v1/info', infoRoutes);
    this.app.use('/api/v1/permissions', permissionRoutes);
    this.app.use('/api/v1/permissions-groups', permissionGroupRoutes);
    this.app.use('/api/v1/functional-areas', functionalAreaRoutes);
    this.app.use('/api/v1/role', roleRoutes);
    this.app.use('/api/v1/therapeutic-area', therapeuticAreaRoutes);
    this.app.use('/api/v1/common', commonRoutes);
    this.app.use('/api/v1/lookup-data', lookupRoutes);
    this.app.use('/api/v1/vendor', vendorRoutes);
    this.app.use('/api/v1/vendor-rooms', vendorRoomRoutes);
    this.app.use('/api/v1/vendor-venue-checklist', vendorVenueChecklistRoutes);
    this.app.use('/api/v1/serviceOffering', serviceOfferingRoutes);
    this.app.use('/api/v1/service-type', serviceTypeRoutes);
    this.app.use('/api/v1/org-hierarchy', orgHierarchyRoutes);



    this.app.use(errorHandler);
  }
  public static async start(port: number) {
    this.app = express();
    this.authHandler = container.get<AuthHandler>(TYPES.AuthHandler);
    await this.authHandler.init();

    // Initialize CronService
    container.get<CronService>(TYPES.CronService);

    this.setupMiddleware(this.authHandler);
    await this.setupRoutes();

    this.server = createServer(this.app);
    this.server.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  }

  public static async stop() {
    if (this.server) {
      return new Promise<void>((resolve) => {
        this.server!.close(() => {
          logger.info('Server stopped');
          resolve();
        });
      });
    }
  }
}

export default App;
