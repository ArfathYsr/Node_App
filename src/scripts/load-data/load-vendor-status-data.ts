import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';
import { repositoryError } from '../../utils/utils';

const prisma = new PrismaClient();

const statuses = [
  {
    name: 'Active',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Inactive',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Draft',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadVendorStatusData() {

  //updating InActive status to Inactive
  const existingStatus = await prisma.vendorStatus.findUnique({
    where: { name: 'InActive' },
  });

  if(existingStatus){
    await prisma.vendorStatus.update({
      where: { id: existingStatus.id },
      data: { name: 'Inactive', updatedBy: 1 },
    });
  }

  await prisma.$transaction(async (prismaClient) => {
    try {
      logger.info('Seeding Vendor status data...');

      // Prepare an array of upsert promises
      const upsertPromises = statuses.map((status) => {
        return prismaClient.vendorStatus.upsert({
          where: { name: status.name },
          update: {},
          create: {
            name: status.name,
            createdBy: status.createdBy,
            updatedBy: status.updatedBy,
          },
        });
      });

      // Execute all upsert operations in parallel within the transaction
      await Promise.all(upsertPromises);

      logger.info('vendor Status details seeded successfully.');
    } catch (error) {
      logger.error('Error inserting data:', error);
      repositoryError(`Error while seeding status data: ${error}`);
    }
  });
}

loadVendorStatusData();
