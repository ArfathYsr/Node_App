import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const vendor = [
  {
    name: 'caterer',
    createdBy: 1,
    updatedBy: 1,
  },

  {
    name: 'venue',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadVendorData() {
  try {
    logger.info('Seeding VendorData...');

    await Promise.all(
      vendor.map(async (data) => {
        if (data.name) {
          await prisma.vendorType.upsert({
            where: { name: data.name },
            update: {},
            create: {
              name: data.name,
              createdBy: data.createdBy,
              updatedBy: data.updatedBy,
            },
          });
        }
      }),
    );

    logger.info('VendorData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadVendorData();
