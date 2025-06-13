import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const internationalPrefixes = [
  {
    name: '+1',
    createdBy: 1,
    updatedBy: 1,
  },

  {
    name: '+90',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadInternationalPrefixData() {
  try {
    logger.info('Seeding InternationalPrefixData...');

    await Promise.all(
      internationalPrefixes.map(async (internationalPrefix) => {
        if (internationalPrefix.name) {
          await prisma.internationalPrefix.upsert({
            where: { name: internationalPrefix.name },
            update: {},
            create: {
              name: internationalPrefix.name,
              createdBy: internationalPrefix.createdBy,
              updatedBy: internationalPrefix.updatedBy,
            },
          });
        }
      }),
    );

    logger.info('internationalPrefix seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadInternationalPrefixData();
