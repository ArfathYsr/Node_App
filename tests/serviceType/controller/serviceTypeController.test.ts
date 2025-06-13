import { NextFunction, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { mock } from 'jest-mock-extended';
import ServiceTypeController from '../../../src/serviceType/controllers/serviceTypeController';
import ServiceTypeService from '../../../src/serviceType/services/serviceTypeService';
import { CustomRequest } from '../../../src/types/express';
import {
  ServiceTypeListShortResponse,
} from '../../../src/serviceType/dto/serviceType.dto';



describe('ServiceTypeController - serviceTypeListShort', () => {
  let serviceTypeController: ServiceTypeController;
  let serviceTypeService: ServiceTypeService;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    serviceTypeService = mock<ServiceTypeService>();
    serviceTypeController = new ServiceTypeController(serviceTypeService);

    mockResponse = {
        status: jest.fn().mockReturnThis(), // Allows chaining of `status`
        json: jest.fn(), // Mocks the `json` method
    } as unknown as Response;

    mockNext = jest.fn();
  });

  it('should return serviceTypeListShort on successful execution', async () => {
    const mockRequest = {
      body: {
        searchText: 'test',
      },
    } as CustomRequest;

    const mockServiceTypeListShortResponse: ServiceTypeListShortResponse = {
      serviceTypeListShort: [
        { id: 1, name: 'Test Service 1', description: 'Description 1'},
        { id: 2, name: 'Test Service 2', description: 'Description 2' },
      ],
      totalServiceTypeCount: 2,
    };

    jest
      .spyOn(serviceTypeService, 'serviceTypeListShort')
      .mockResolvedValue(mockServiceTypeListShortResponse);

    await serviceTypeController.serviceTypeListShort(
      mockRequest,
      mockResponse,
      mockNext
    );

    expect(serviceTypeService.serviceTypeListShort).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(mockResponse.json).toHaveBeenCalledWith(mockServiceTypeListShortResponse);
  });

  it('should call next(error) on service error', async () => {
    const mockRequest = {
      body: {
        searchText: 'test',
      },
    } as CustomRequest;

    const mockError = new Error('Service error');

    jest
      .spyOn(serviceTypeService, 'serviceTypeListShort')
      .mockRejectedValue(mockError);

    await serviceTypeController.serviceTypeListShort(
      mockRequest,
      mockResponse,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
  
});
