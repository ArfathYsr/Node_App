import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

export const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

jest.mock('@prisma/client', () => {
  const actualPrisma: object = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => ({
      vendor: {
        create: jest.fn(),
      },
      vendorAddressDetails: {
        count: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    })),
  };
});
