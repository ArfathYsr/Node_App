import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { Container } from 'inversify';
import OrgHierarchyController from '../../../src/orgHierarchy/controllers/orgHierarchyController';
import OrgHierarchyService from '../../../src/orgHierarchy/services/orgHierarchyService';
import TYPES from '../../../src/dependencyManager/types';
import { mockData, mockHierarchyList } from '../data/fixture.orgHierarchy';
import { HttpStatusCode } from 'axios';

const container = new Container();
container.bind<OrgHierarchyService>(TYPES.OrgHierarchyService).toConstantValue({
  listOrgHierarchy: jest.fn(),
} as unknown as OrgHierarchyService);
container.bind<OrgHierarchyController>(OrgHierarchyController).toSelf();

describe('OrgHierarchyController - listOrgHierarchy', () => {
  let orgHierarchyController: OrgHierarchyController;
  let orgHierarchyService: OrgHierarchyService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeAll(() => {
    orgHierarchyController = container.get<OrgHierarchyController>(OrgHierarchyController);
    orgHierarchyService = container.get<OrgHierarchyService>(TYPES.OrgHierarchyService);

    mockRequest = { body: mockData };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hierarchy data when service succeeds', async () => {
    (orgHierarchyService.listOrgHierarchy as jest.Mock).mockResolvedValue({
      clientHierarchyList: mockHierarchyList,
      totalAmount: mockHierarchyList.length,
    });

    await orgHierarchyController.listOrgHierarchy(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(mockResponse.json).toHaveBeenCalledWith({
      clientHierarchyList: mockHierarchyList,
      totalAmount: mockHierarchyList.length,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws an error', async () => {
    const error = new Error('Service Error');
    (orgHierarchyService.listOrgHierarchy as jest.Mock).mockRejectedValue(error);

    await orgHierarchyController.listOrgHierarchy(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
