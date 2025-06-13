import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import TYPES from '../dependencyManager/types';
import RepositoryError from '../error/repositoryError';

@injectable()
export default class CronService {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
    cron.schedule('5 0 * * *', async () => {
      // Set cron time for 12.05 AM IST
      await this.updateActiveStatus('role');
      await this.updateActiveStatus('permission');
      await this.updateActiveStatus('permissionGroup');
      await this.updateActiveStatus('functionalArea');
      await this.updateActiveStatus('client');
    });
  }

  async updateActiveStatus(tableName: string) {
    try {
      
      const statusColumn = tableName === 'client' ? 'clientStatusId' : 'statusId';
      const currentDate = new Date();

      await this.prisma[tableName].updateMany({
        where: {
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
        NOT: {
          [statusColumn]: 1,
        },
        data: {
          [statusColumn]: 1
        },
      });
      
      await this.prisma[tableName].updateMany({
        where: {
          OR: [
            {
              endDate: { lte: currentDate }
            },
            {
              startDate: { gte: currentDate }
            }
          ]
        },
        NOT: {
          [statusColumn]: 2,
        },
        data: {
          [statusColumn]: 2,
        },
      });
      
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async updateStatusBasedOnCurrentDate(tableName: string) {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const statusColumn = tableName === 'client' ? 'clientStatusId' : 'statusId';
      const getRecords = await this.prisma[tableName].findMany({
        where: {
          endDate: {
            not: null,
          },
          startDate: {
            gte: startOfToday,
            lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
          },
          [statusColumn]: 2,
        },
      });

      if (getRecords && getRecords.length !== 0) {
        const result = await this.prisma[tableName].updateMany({
          where: {
            endDate: {
              not: null,
            },
            startDate: {
              gte: startOfToday,
              lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
            },
            [statusColumn]: 2,
          },
          data: {
            [statusColumn]: 1,
          },
        });
        return result;
      }
    } catch (error) {
      console.error('Error updating records:', error);
      throw error;
    }
  }

  async getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday;
  }
}
