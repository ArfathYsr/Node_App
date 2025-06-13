import { Container } from 'inversify';
import { Logger } from 'winston';
import { PrismaClient } from '@prisma/client';
import TYPES from './types';
import AuthService from '../auth/services/authService';
import AuthController from '../auth/controllers/authController';
import ClientController from '../client/controllers/clientController';
import logger from '../libs/logger';
import HttpIntegrationConnector from '../libs/httpIntegrationConnector';
import AuthHandler from '../libs/authHandler';
import PublicAuthController from '../auth/controllers/publicAuthController';
import PublicAuthService from '../auth/services/publicAuthService';
import InfoService from '../info/services/infoService';
import InfoController from '../info/controllers/infoController';
import ClientService from '../client/services/clientService';
import ClientRepository from '../client/repositories/clientRepository';
import CountryRepository from '../info/repositories/countryRepository';
import FunctionalAreaController from '../functionalArea/controllers/functionalAreaController';
import FunctionalAreaService from '../functionalArea/services/functionalAreaService';
import FunctionalAreaRepository from '../functionalArea/repositories/functionalAreaRepository';
import RoleService from '../roles/services/roleService';
import RoleRepository from '../roles/repositories/roleRepository';
import RoleController from '../roles/controllers/roleController';
import { S3Service } from '../libs/s3Service';
import PermissionService from '../permission/services/permissionService';
import PermissionGroupService from '../permissionGroup/services/permissionGroupService';
import PermissionRepository from '../permission/repositories/permissionRepository';
import PermissionGroupRepository from '../permissionGroup/repositories/permissionGroupRepository';
import PermissionController from '../permission/controllers/permissionController';
import PermissionGroupController from '../permissionGroup/controllers/permissionGroupController';
import ProfileService from '../profile/services/profileService';
import ProfileController from '../profile/controllers/profileController';
import ProfileRepository from '../profile/repositories/profileRepository';
import DateService from '../libs/dateService';
import StringTransformService from '../libs/stringTransformService';
import HistoryService from '../utils/historyService';
import TherapeuticAreaRepository from '../therapeuticArea/repositories/therapeuticAreaRepository';
import TherapeuticAreaController from '../therapeuticArea/controllers/therapeuticAreaController';
import TherapeuticAreaService from '../therapeuticArea/services/therapeuticAreaService';
import CronService from '../utils/cronService';
import CommonService from '../common/services/commonService';
import CommonRepository from '../common/repositories/commonRepository';
import CommonController from '../common/controllers/commonController';
import VendorRepository from '../vendor/repositories/vendorRepository';
import VendorController from '../vendor/controllers/vendorController';
import VendorService from '../vendor/services/vendorService';
import MasterProfileRepository from '../profile/repositories/masterProfileRepository';
import LookupDataService from '../lookupData/services/lookupDataService';
import LookupDataController from '../lookupData/controllers/lookupDataController';
import LookupDataRepository from '../lookupData/repositories/lookupDataRepository';
import VendorVenueChecklistController from '../vendorVenueChecklist/controllers/vendorVenueChecklistController';
import VendorVenueChecklistRepository from '../vendorVenueChecklist/repositories/vendorVenueChecklistRepository';
import VendorVenueChecklistService from '../vendorVenueChecklist/services/vendorVenueChecklistService';

import VendorRoomService from '../vendorRooms/services/vendorRoomService';
import VendorRoomRepository from '../vendorRooms/repositories/vendorRoomRepository';
import VendorRoomController from '../vendorRooms/controllers/vendorRoomController';

import ServiceOfferingRepository from '../serviceOffering/repositories/serviceOfferingRepository';
import ServiceOfferingController from '../serviceOffering/controllers/serviceOfferingController';
import ServiceOfferingService from '../serviceOffering/services/serviceOfferingService';
import ServiceTypeService from '../serviceType/services/serviceTypeService';
import ServiceTypeRepository from '../serviceType/repositories/serviceTypeRepository';
import ServiceTypeController from '../serviceType/controllers/serviceTypeController';

import OrgHierarchyRepository from '../orgHierarchy/repositories/orgHierarchyRepository';
import OrgHierarchyController from '../orgHierarchy/controllers/orgHierarchyController';
import OrgHierarchyService from '../orgHierarchy/services/orgHierarchyService';
const container = new Container();

// Bind services
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<DateService>(TYPES.DateService).to(DateService);
container
  .bind<StringTransformService>(TYPES.StringTransformService)
  .to(StringTransformService);
container
  .bind<PublicAuthService>(TYPES.PublicAuthService)
  .to(PublicAuthService);
container.bind<ClientService>(TYPES.ClientService).to(ClientService);
container.bind<InfoService>(TYPES.InfoService).to(InfoService);
container
  .bind<PermissionService>(TYPES.PermissionService)
  .to(PermissionService);
container
  .bind<PermissionGroupService>(TYPES.PermissionGroupService)
  .to(PermissionGroupService);
container.bind<ProfileService>(TYPES.ProfileService).to(ProfileService);
container
  .bind<FunctionalAreaService>(TYPES.FunctionalAreaService)
  .to(FunctionalAreaService);
container.bind<RoleService>(TYPES.RoleService).to(RoleService);
container
  .bind<TherapeuticAreaService>(TYPES.TherapeuticAreaService)
  .to(TherapeuticAreaService);
container.bind<CommonService>(TYPES.CommonService).to(CommonService);
container
  .bind<LookupDataService>(TYPES.LookupDataService)
  .to(LookupDataService);
container
  .bind<VendorVenueChecklistService>(TYPES.VendorVenueChecklistService)
  .to(VendorVenueChecklistService);
container
  .bind<VendorRoomService>(TYPES.VendorRoomService)
  .to(VendorRoomService);
container
  .bind<ServiceOfferingService>(TYPES.SeviceOfferingService)
  .to(ServiceOfferingService);
  container
  .bind<ServiceTypeService>(TYPES.ServiceTypeService)
  .to(ServiceTypeService);
container
  .bind<OrgHierarchyService>(TYPES.OrgHierarchyService)
  .to(OrgHierarchyService);

// Bind repositories
container.bind<ClientRepository>(TYPES.ClientRepository).to(ClientRepository);
container.bind<CountryRepository>(TYPES.CountryRepository).to(CountryRepository);
container
  .bind<PermissionRepository>(TYPES.PermissionRepository)
  .to(PermissionRepository);
container
  .bind<PermissionGroupRepository>(TYPES.PermissionGroupRepository)
  .to(PermissionGroupRepository);
container
  .bind<ProfileRepository>(TYPES.ProfileRepository)
  .to(ProfileRepository);
container
  .bind<MasterProfileRepository>(TYPES.MasterProfileRepository)
  .to(MasterProfileRepository);
container
  .bind<FunctionalAreaRepository>(TYPES.FunctionalAreaRepository)
  .to(FunctionalAreaRepository);
container.bind<RoleRepository>(TYPES.RoleRepository).to(RoleRepository);
container
  .bind<TherapeuticAreaRepository>(TYPES.TherapeuticAreaRepository)
  .to(TherapeuticAreaRepository);
container.bind<CommonRepository>(TYPES.CommonRepository).to(CommonRepository);
container
  .bind<LookupDataRepository>(TYPES.LookupDataRepository)
  .to(LookupDataRepository);
container.bind<VendorRepository>(TYPES.VendorRepository).to(VendorRepository);
container
  .bind<VendorVenueChecklistRepository>(TYPES.VendorVenueChecklistRepository)
  .to(VendorVenueChecklistRepository);
container
  .bind<VendorRoomRepository>(TYPES.VendorRoomRepository)
  .to(VendorRoomRepository);
container
  .bind<ServiceOfferingRepository>(TYPES.ServiceOfferingRepository)
  .to(ServiceOfferingRepository);  
  container
  .bind<ServiceTypeRepository>(TYPES.ServiceTypeRepository)
  .to(ServiceTypeRepository);
container
  .bind<OrgHierarchyRepository>(TYPES.OrgHierarchyRepository)
  .to(OrgHierarchyRepository);


// Bind controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container
  .bind<PublicAuthController>(TYPES.PublicAuthController)
  .to(PublicAuthController);
container.bind<InfoController>(TYPES.InfoController).to(InfoController);
container.bind<ClientController>(TYPES.ClientController).to(ClientController);
container
  .bind<PermissionController>(TYPES.PermissionController)
  .to(PermissionController);
container
  .bind<PermissionGroupController>(TYPES.PermissionGroupController)
  .to(PermissionGroupController);
container
  .bind<ProfileController>(TYPES.ProfileController)
  .to(ProfileController);
container
  .bind<FunctionalAreaController>(TYPES.FunctionalAreaController)
  .to(FunctionalAreaController);
container.bind<RoleController>(TYPES.RoleController).to(RoleController);
container
  .bind<TherapeuticAreaController>(TYPES.TherapeuticAreaController)
  .to(TherapeuticAreaController);
container.bind<CommonController>(TYPES.CommonController).to(CommonController);
container
  .bind<LookupDataController>(TYPES.LookupDataController)
  .to(LookupDataController);
container.bind<VendorController>(TYPES.VendorController).to(VendorController);
container
  .bind<VendorVenueChecklistController>(TYPES.VendorVenueChecklistController)
  .to(VendorVenueChecklistController);
container
  .bind<VendorRoomController>(TYPES.VendorRoomController)
  .to(VendorRoomController);
container
  .bind<ServiceOfferingController>(TYPES.ServiceOfferingController)
  .to(ServiceOfferingController);  
  container
  .bind<ServiceTypeController>(TYPES.ServiceTypeController)
  .to(ServiceTypeController);

container
  .bind<OrgHierarchyController>(TYPES.OrgHierarchyController)
  .to(OrgHierarchyController);


// Bind libs
container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
container
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toConstantValue(new PrismaClient());

container.bind<AuthHandler>(TYPES.AuthHandler).to(AuthHandler);
container.bind<S3Service>(TYPES.S3Service).toConstantValue(new S3Service());
container.bind<HistoryService>(TYPES.HistoryService).to(HistoryService);
container.bind<CronService>(TYPES.CronService).to(CronService);
container.bind<VendorService>(TYPES.VendorService).to(VendorService);
// Bind HttpIntegrationConnector
container
  .bind<HttpIntegrationConnector>(TYPES.HttpIntegrationConnector)
  .to(HttpIntegrationConnector);

export default container;
