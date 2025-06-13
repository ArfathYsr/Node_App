import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const actionTypes = [
  {
    typeName: 'Actions',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    typeName: 'Email',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadWorkItemActionTypeData() {
  try {
    logger.info('Seeding Work Item ActionType Data...');

    await Promise.all(
        actionTypes.map(async (type) => {
        await prisma.workItemActionType.upsert({
          where: { name: type.typeName },
          update: {},
          create: {
            name: type.typeName,
            createdBy: type.createdBy,
            updatedBy: type.updatedBy,
          },
        });
      }),
    );
    logger.info('Work Item ActionType details seeded successfully.');
  } catch (error) {
    logger.error('Error inserting Work Item ActionType data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadWorkItemActionTypeData();
