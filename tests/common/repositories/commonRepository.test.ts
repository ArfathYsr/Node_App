import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { mockPrismaClient } from '../data/prisma';
import TYPES from '../../../src/dependencyManager/types';
import { ERROR_MESSAGES } from '../../../src/utils/message';

import CommonRepository from '../../../src/common/repositories/commonRepository';

const mockCount = 1;
// Set up Inversify container
const container = new Container();
container
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toConstantValue(mockPrismaClient as unknown as PrismaClient);
container.bind<CommonRepository>(CommonRepository).toSelf();
describe('CommonRepository', () => {
  let commonRepository: CommonRepository;
  beforeAll(() => {
    commonRepository = container.get<CommonRepository>(CommonRepository);
  });

  beforeEach(() => {
    mockPrismaClient.status.count.mockResolvedValue(mockCount);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct response structure', async () => {
    const mockStatus = [
      {
        id: 1,
        statusName: 'ABC',
        createdAt: new Date('2025-01-06T17:16:37.939Z'),
        updatedAt: new Date('2025-01-06T17:16:37.939Z'),
        createdBy: 1,
        updatedBy: 1,
      },
    ];

    mockPrismaClient.status.findMany.mockResolvedValue(mockStatus);
    mockPrismaClient.status.count.mockResolvedValue(mockCount);
    const response = await commonRepository.listStatus();
    expect(response).toEqual(mockStatus);
  });
  it('should return a 500 error if something goes wrong', async () => {
    mockPrismaClient.status.findMany.mockRejectedValue(
      new Error(ERROR_MESSAGES.DATABASE_ERROR),
    );
    await expect(commonRepository.listStatus()).rejects.toThrow(
      ERROR_MESSAGES.DATABASE_ERROR,
    );
  });
});
