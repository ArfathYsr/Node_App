import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const workItems = [
  {
    name: 'Speaker Cancellation email will be sent to the EO',
    actionTypeId: 1,
    statusId: 2, 
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Send Speaker Confirmation',
    actionTypeId: 1,
    statusId: 3, 
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Same day Cancellation',
    actionTypeId: 1,
    statusId: 2, 
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Invitation to Speak',
    actionTypeId: 2,
    statusId: 1, 
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Post meeting remainder',
    actionTypeId: 2,
    statusId: 1, 
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadWorkItemsData() {
  try {
    logger.info('Seeding Work Items Data...');

    await Promise.all(
        workItems.map(async (item) => {
        await prisma.workItem.upsert({
          where: { name: item.name },
          update: {},
          create: {
            name: item.name,
            actionTypeId: item.actionTypeId,
            statusId: item.statusId,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
          },
        });
      }),
    );
    logger.info('Work Items details seeded successfully.');
  } catch (error) {
    logger.error('Error inserting Work Items data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadWorkItemsData();
