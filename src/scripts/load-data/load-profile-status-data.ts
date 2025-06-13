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
    statusName: 'Inactive',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    statusName: 'Draft',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadCommonStatusData() {
  try {
    logger.info('Seeding status data...');

    //updating InActive status to Inactive
    const existingStatus = await prisma.profileStatus.findUnique({
      where: { statusName: 'InActive' },
    });

    if(existingStatus){
      await prisma.profileStatus.update({
        where: { id: existingStatus.id },
        data: { statusName: 'Inactive', updatedBy: 1 },
      });
    }

    await Promise.all(
      statuses.map(async (status) => {
        await prisma.profileStatus.upsert({
          where: { statusName: status.statusName },
          update: {},
          create: {
            statusName: status.statusName,
            createdBy: status.createdBy,
            updatedBy: status.updatedBy,
          },
        });
      }),
    );
    logger.info('Status details seeded successfully.');
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadCommonStatusData();
