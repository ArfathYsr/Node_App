import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

const mockPrismaClient = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(mockPrismaClient);
});

export { mockPrismaClient };
