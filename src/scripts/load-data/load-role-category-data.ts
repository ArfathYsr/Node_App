import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const roleCategory = [
  {
    roleCategoryName: 'Speaker',
    createdBy: 1,
    updatedBy: 1,
    isActive: true,
  },
  {
    roleCategoryName: 'Attendee',
    createdBy: 1,
    updatedBy: 1,
    isActive: true,
  },
  {
    roleCategoryName: 'Attendee Speaker',
    createdBy: 1,
    updatedBy: 1,
    isActive: true,
  },
];

async function loadRoleCateoryData() {
  try {
    logger.info('Seeding role category...');

    await Promise.all(
      roleCategory.map(async (rc) => {
        await prisma.roleCategory.upsert({
          where: { roleCategoryName: rc.roleCategoryName },
          update: {},
          create: {
            roleCategoryName: rc.roleCategoryName,
            createdBy: 1,
            updatedBy: 1,
            isActive: true,
          },
        });
      }),
    );

    logger.info('Rolecategory details seeded successfully.');
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadRoleCateoryData();
