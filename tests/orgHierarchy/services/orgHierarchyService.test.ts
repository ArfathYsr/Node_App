import 'reflect-metadata';
import { Container } from 'inversify';
import OrgHierarchyService from '../../../src/orgHierarchy/services/orgHierarchyService';
import OrgHierarchyRepository from '../../../src/orgHierarchy/repositories/orgHierarchyRepository';
import TYPES from '../../../src/dependencyManager/types';
import { mockData, mockHierarchyList } from '../data/fixture.orgHierarchy';

const container = new Container();
container.bind<OrgHierarchyRepository>(TYPES.OrgHierarchyRepository).toConstantValue({
  listOrgHierarchy: jest.fn(),
} as unknown as OrgHierarchyRepository);

container.bind<OrgHierarchyService>(OrgHierarchyService).toSelf();

describe('OrgHierarchyService - listOrgHierarchy', () => {
  let orgHierarchyService: OrgHierarchyService;
  let orgHierarchyRepository: OrgHierarchyRepository;

  beforeAll(() => {
    orgHierarchyService = container.get<OrgHierarchyService>(OrgHierarchyService);
    orgHierarchyRepository = container.get<OrgHierarchyRepository>(TYPES.OrgHierarchyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of hierarchy data when called', async () => {
    (orgHierarchyRepository.listOrgHierarchy as jest.Mock).mockResolvedValue({
      clientHierarchyList: mockHierarchyList,
      totalAmount: mockHierarchyList.length,
    });

    const result = await orgHierarchyService.listOrgHierarchy(mockData);

    expect(result).toEqual({
      clientHierarchyList: mockHierarchyList,
      totalAmount: mockHierarchyList.length,
    });

    expect(orgHierarchyRepository.listOrgHierarchy).toHaveBeenCalledWith(mockData);
  });

  it('should handle errors thrown by the repository', async () => {
    (orgHierarchyRepository.listOrgHierarchy as jest.Mock).mockRejectedValue(
      new Error('Repository Error')
    );

    await expect(orgHierarchyService.listOrgHierarchy(mockData)).rejects.toThrow('Repository Error');
    expect(orgHierarchyRepository.listOrgHierarchy).toHaveBeenCalledWith(mockData);
  });
});
