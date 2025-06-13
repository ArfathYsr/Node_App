import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const statuses = [
  {
    statusName: 'Active',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    statusName: 'Speaker Declined',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    statusName: 'Accepted',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadWorkItemStatusData() {
  try {
    logger.info('Seeding Work Items Status data...');

    //updating InActive status to Inactive
    const existingStatus = await prisma.status.findUnique({
      where: { statusName: 'InActive' },
    });

    if(existingStatus){
      await prisma.status.update({
        where: { id: existingStatus.id },
        data: { statusName: 'Inactive', updatedBy: 1 },
      });
    }

    await Promise.all(
      statuses.map(async (status) => {
        await prisma.workItemStatus.upsert({
          where: { name: status.statusName },
          update: {},
          create: {
            name: status.statusName,
            createdBy: status.createdBy,
            updatedBy: status.updatedBy,
          },
        });
      }),
    );
    logger.info('Work Items Status details seeded successfully.');
  } catch (error) {
    logger.error('Error inserting Work Items Status data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadWorkItemStatusData();
