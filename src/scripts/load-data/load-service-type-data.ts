import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const serviceTypeData = [
  {
    name: 'Engagement Acceptance',
    description: 'Engagement Acceptance',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
 {
    name: 'Budget management',
    description: 'Budget management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Speaker management',
    description: 'Speaker management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
   {
    name: 'Travel management',
    description: 'Travel management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },

  {
    name: 'Location management',
    description: 'Location management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'AV management',
    description: 'AV management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
   {
    name: 'Caterer management',
    description: 'Caterer management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Docuement management',
    description: 'Docuement management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },

   {
    name: 'Collaboration management',
    description: 'Collaboration management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },

     {
    name: 'Venue management',
    description: 'Collaboration management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },

   {
    name: 'Atendee management',
    description: 'Certification management',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadServiceTypeData() {
  try {
    logger.info('Seeding service type data...');

     const uniqueServiceTypeData = Array.from(
      new Map(serviceTypeData.map(item => [item.name, item])).values()
    );
    
    await Promise.all(
          serviceTypeData.map(async (serviceType) => {
        await prisma.serviceType.upsert({
          where: { name: serviceType.name },
          update: {},
          create: {
            name: serviceType.name,
            description: serviceType.description,
            isActive:serviceType.isActive,
            createdBy: 1,
            updatedBy: 1,
          },
        });
      }),
    );

    logger.info('service Type seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadServiceTypeData();
