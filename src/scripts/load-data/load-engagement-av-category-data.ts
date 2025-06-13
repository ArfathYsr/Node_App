import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const Prisma = new PrismaClient();

async function loadAvCategoryData() {
  try {
    logger.info('Deleting existing menus and their permissions...');

    logger.info('Adding av category data...');
    const avCategory = [
      {
        name: 'Pre-set packages',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Mobile device equipment',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Presentation equipment',
        createdBy: 1,
        updatedBy: 1,
      }
    ];

    await Prisma.$transaction(async (prisma) => {
      for (const av of avCategory) {
        await prisma.lookup_avCategory.upsert({
          where: {
            name: av.name
          },
          update: {},
          create: {
            name: av.name,
            isActive:true,
            createdBy: av.createdBy,
            updatedBy: av.updatedBy,
          },
        });
      }
    });

    logger.info('Av category data seeded successfully.');
  } catch (error) {
    logger.error('Error seeding menu data:', error);
    throw error;
  } finally {
    await Prisma.$disconnect();
  }
}

loadAvCategoryData();
