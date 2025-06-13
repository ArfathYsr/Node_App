import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const countries = [{ code: 'US', name: 'United States' }];

async function loadCountryData() {
  try {
    logger.info('Seeding countries...');

    await Promise.all(
      countries.map(async (country) => {
        await prisma.country.upsert({
          where: { code: country.code },
          update: {},
          create: {
            code: country.code,
            name: country.name,
          },
        });
      }),
    );

    logger.info('Countries seeded successfully.');
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadCountryData();
