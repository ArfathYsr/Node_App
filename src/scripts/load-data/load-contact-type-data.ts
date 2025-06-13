import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const contact = [
  {
    id: 1,
    name: 'phone',
    createdBy: 1,
    updatedBy: 1,
  },

  {
    id: 2,
    name: 'tele-phone',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadContactData() {
  try {
    logger.info('Seeding ContactData...');

    await Promise.all(
      contact.map(async (data) => {
        if (data.name) {
          await prisma.contactType.upsert({
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

    logger.info('ContactData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadContactData();
