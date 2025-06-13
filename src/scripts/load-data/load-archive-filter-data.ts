import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const archiveFilters = [
  { name: 'Include Archived Records' },
  { name: 'Show All Archived' },
];

async function loadArchiveFilterData() {
  try {
    logger.info('Seeding Archive Filters data...');

    await Promise.all(
      archiveFilters.map(async (filter) => {
        await prisma.archiveFilter.upsert({
          where: { name: filter.name },
          update: {
            updatedBy: 1,
          },
          create: {
            name: filter.name,
            createdBy: 1,
            updatedBy: 1,
          },
        });
      }),
    );

    logger.info('Archive Filters seeded successfully.');
  } catch (error) {
    logger.error('Error inserting Archive Filters data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadArchiveFilterData();
