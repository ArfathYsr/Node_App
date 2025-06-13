import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const cities = [
  {
    id: 1,
    name: 'Banglore',
    createdBy: 1,
    updatedBy: 1,
  },

  {
    id: 2,
    name: 'Mumbai',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 3,
    name: 'Chennai',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadCityData() {
  try {
    logger.info('Seeding CityData...');

    await Promise.all(
      cities.map(async (city) => {
        if (city.name) {
          await prisma.city.upsert({
            where: { id: city.id },
            update: {},
            create: {
              name: city.name,
              createdBy: city.createdBy,
              updatedBy: city.updatedBy,
            },
          });
        }
      }),
    );

    logger.info('CityData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadCityData();
