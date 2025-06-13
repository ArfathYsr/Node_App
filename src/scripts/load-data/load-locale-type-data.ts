import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();
const locales = [
  { Name: 'US', isActive: true },
  { Name: 'EN', isActive: true },
];

async function loadLocaleTypesData() {
  try {
    logger.info('Running seed loadLocaleTypesData');
    await Promise.all(
      locales.map(async (locale) => {
        await prisma.locale.upsert({
          where: {
            name: locale.Name,
          },
          update: {
            updatedBy: 1,
          },
          create: {
            name: locale.Name,
            isActive: locale.isActive,
            createdBy: 1,
            updatedBy: 1,
          },
        });
        logger.info(`Inserted successfully: ${locale.Name}`);
      }),
    );
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadLocaleTypesData();
