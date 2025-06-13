import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const avData = [
    {
      id:1,
      name: 'packages 1',
      description:"description 1",
      avCategoryId:1,
      price:540,
      createdBy: 1,
      updatedBy: 1,
    },
    {
      id:2,
      name: 'packages 2',
      description:"description 2",
      avCategoryId:1,
      price:120,
      createdBy: 1,
      updatedBy: 1,
    },
    {
      id:3,
      name: 'Wireless Lavalier',
      description:"",
      avCategoryId:2,
      price:25,
      createdBy: 1,
      updatedBy: 1,
    },
    {
      id:4,
      name: 'Handheld Microphone',
      description:"",
      avCategoryId:2,
      price:25,
      createdBy: 1,
      updatedBy: 1,
    },
    {
      id:5,
      name: 'LCD Projector',
      description:"",
      avCategoryId:3,
      price:50,
      createdBy: 1,
      updatedBy: 1,
    },
    {
      id:6,
      name: 'Screen with Extension Cord',
      description:"",
      avCategoryId:3,
      price:100,
      createdBy: 1,
      updatedBy: 1,
    },
  ];
async function loadEngagementAVData() {
  try {
    logger.info('Seeding Work Items Data...');

    await Promise.all(
        avData?.map(async (item) => {
        await prisma.lookup_av.upsert({
          where: { name: item.name },
          update: {},
          create: {
            name: item.name,
            description: item.description,
            price: item.price,
            avCategoryId: item.avCategoryId,
            isActive:true,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
          },
        });
      }),
    );
    logger.info('Av data seeded successfully.');
  } catch (error) {
    logger.error('Error inserting Work Items data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadEngagementAVData();
