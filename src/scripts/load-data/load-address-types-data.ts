import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

async function loadAddressTypesData() {
  try {
    logger.info('Running seed loadAddressTypesData');
    const addressTypes = [
      { type: 'Default', name: 'Home', isActive: true },
      { type: 'Office', name: 'Office', isActive: true },
      { type: 'Business', name: 'Business', isActive: true },
      { type: 'Practice', name: 'Practice', isActive: true },
      { type: 'HCO', name: 'HCO', isActive: true },
    ];
    
    await Promise.all(
      addressTypes.map((addressType) =>
        prisma.addressType.upsert({
          where: {
            type: addressType.type,
          },
          update: {},
          create: addressType,
        })
      )
    );
    logger.info('Inserted successfully');
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadAddressTypesData();
