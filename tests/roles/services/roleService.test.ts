import { Container } from 'inversify';
import 'reflect-metadata';
import config from 'config';
import RoleService from '../../../src/roles/services/roleService';
import RoleRepository from '../../../src/roles/repositories/roleRepository';
import TYPES from '../../../src/dependencyManager/types';
import { CreateRoleDto } from '../../../src/roles/dto/role.dto';
import HistoryService from '../../../src/utils/historyService';
import DateService from '../../../src/libs/dateService';
import ClientRepository from '../../../src/client/repositories/clientRepository';
import PermissionRepository from '../../../src/permission/repositories/permissionRepository';

jest.mock('config', () => ({
  get: jest.fn(),
}));

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: RoleRepository;
  let historyService: HistoryService;
  let dateService: DateService;
  let clientRepository: ClientRepository;
  let permissionRepository: PermissionRepository;

  const mockDateObject = new Date();
  jest.spyOn(global, 'Date').mockImplementation(() => mockDateObject);

  jest.spyOn(config, 'get').mockReturnValue('2024-12-31');
  jest
    .spyOn(RoleService.prototype as any, 'getDefaultEndDate')
    .mockImplementation(() => new Date('2024-12-31'));

  beforeEach(() => {
    const container = new Container();
    roleRepository = {
      findRoleByName: jest.fn(),
      createRole: jest.fn(),
    } as unknown as RoleRepository;

    historyService = {
      trackFieldChanges: jest.fn(),
    } as unknown as HistoryService;
    dateService = {} as DateService;
    clientRepository = {} as ClientRepository;
    permissionRepository = {} as PermissionRepository;

    container
      .bind<RoleRepository>(TYPES.RoleRepository)
      .toConstantValue(roleRepository);
    container
      .bind<HistoryService>(TYPES.HistoryService)
      .toConstantValue(historyService);
    container.bind<DateService>(TYPES.DateService).toConstantValue(dateService);
    container
      .bind<ClientRepository>(TYPES.ClientRepository)
      .toConstantValue(clientRepository);
    container
      .bind<PermissionRepository>(TYPES.PermissionRepository)
      .toConstantValue(permissionRepository);
    container.bind<RoleService>(RoleService).toSelf();

    roleService = container.get<RoleService>(RoleService);
  });

  it('should create a role successfully', async () => {
    const createRoleDto: CreateRoleDto = {
      name: 'TestRole',
      description: 'Test description',
      functionalAreaId: 1,
      permissionGroupIds: [1],
      startDate: new Date('2024-12-18T13:36:54.106Z'),
      endDate: new Date('2024-12-19T13:36:54.106Z'),
      isExternal: false,
      type: 'string',
      cloneId: 1,
      isActive: true,
      createdBy: 1,
      updatedBy: 1,
    };

    (roleRepository.findRoleByName as jest.Mock).mockResolvedValue(null);
    (roleRepository.createRole as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await roleService.createRole(createRoleDto);

    expect(result).toEqual({ role: { id: 1 } });
    expect(roleRepository.findRoleByName).toHaveBeenCalledWith('TestRole');
    expect(roleRepository.createRole).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'TestRole',
        description: 'Test description',
      }),
    );
    expect(historyService.trackFieldChanges).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if role name already exists', async () => {
    const createRoleDto: CreateRoleDto = {
      name: 'TR1',
      description: 'Test description',
      functionalAreaId: 1,
      permissionGroupIds: [1],
      startDate: new Date('2024-12-18T13:36:54.106Z'),
      endDate: new Date('2024-12-19T13:36:54.106Z'),
      isExternal: false,
      type: 'type1',
      cloneId: 1,
      isActive: false,
      createdBy: 1,
      updatedBy: 1,
    };

    (roleRepository.findRoleByName as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(roleService.createRole(createRoleDto)).rejects.toThrow(
      `Role name ${createRoleDto.name} already exists.`,
    );
  });
});
