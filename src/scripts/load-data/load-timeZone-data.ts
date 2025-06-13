import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const timeZones = [
  {
    name: 'India Standard Time',
    isActive: true,
    utcOffset: '+05:30',
    abbreviation: 'IST',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Eastern Standard Time',
    isActive: true,
    utcOffset: '-05:00',
    abbreviation: 'EST',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Coordinated Universal Time',
    isActive: true,
    utcOffset: '+00:00',
    abbreviation: 'UTC',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Pacific Standard Time',
    isActive: true,
    utcOffset: '-08:00',
    abbreviation: 'PST',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Japan Standard Time',
    isActive: true,
    utcOffset: '+09:00',
    abbreviation: 'JST',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadTimeZonesData() {
  try {
    logger.info('Seeding TimeZonesData...');

    await Promise.all(
      timeZones.map(async (timeZone) => {
        if (timeZone.name) {
          await prisma.timeZone.upsert({
            where: { name: timeZone.name },
            update: {},
            create: {
              name: timeZone.name,
              abbreviation: timeZone.abbreviation,
              utcOffset: timeZone.utcOffset,
              isActive: timeZone.isActive,
              createdBy: timeZone.createdBy,
              updatedBy: timeZone.updatedBy,
            },
          });
        }
      }),
    );

    logger.info('timeZOne seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadTimeZonesData();
