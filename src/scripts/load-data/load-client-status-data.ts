import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const clientStatuses = [
  { name: 'Active' },
  { name: 'Inactive' },
  { name: 'Draft' },
];

async function loadClientStatusData() {
  try {
    logger.info('Seeding Client Statuses data...');

    //updating InActive status to Inactive
    const existingStatus = await prisma.clientStatus.findUnique({
      where: { name: 'InActive' },
    });

    if(existingStatus){
      await prisma.clientStatus.update({
        where: { id: existingStatus.id },
        data: { name: 'Inactive', updatedBy: 1 },
      });
    }

    await Promise.all(
      clientStatuses.map(async (clientStatus) => {
        await prisma.clientStatus.upsert({
          where: { name: clientStatus.name },
          update: {},
          create: {
            name: clientStatus.name,
            createdBy: 1,
            updatedBy: 1,
          },
        });
      }),
    );

    logger.info('Client Statuses seeded successfully.');
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadClientStatusData();
