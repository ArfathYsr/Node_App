import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const states = [
  { id: 1, name: 'AL', createdBy: 1, updatedBy: 1 },
  { id: 2, name: 'AK', createdBy: 1, updatedBy: 1 },
  { id: 3, name: 'AZ', createdBy: 1, updatedBy: 1 },
  { id: 4, name: 'AR', createdBy: 1, updatedBy: 1 },
  { id: 5, name: 'CA', createdBy: 1, updatedBy: 1 },
  { id: 6, name: 'CO', createdBy: 1, updatedBy: 1 },
  { id: 7, name: 'CT', createdBy: 1, updatedBy: 1 },
  { id: 8, name: 'DE', createdBy: 1, updatedBy: 1 },
  { id: 9, name: 'FL', createdBy: 1, updatedBy: 1 },
  { id: 10, name: 'GA', createdBy: 1, updatedBy: 1 },
  { id: 11, name: 'HI', createdBy: 1, updatedBy: 1 },
  { id: 12, name: 'ID', createdBy: 1, updatedBy: 1 },
  { id: 13, name: 'IL', createdBy: 1, updatedBy: 1 },
  { id: 14, name: 'IN', createdBy: 1, updatedBy: 1 },
  { id: 15, name: 'IA', createdBy: 1, updatedBy: 1 },
  { id: 16, name: 'KS', createdBy: 1, updatedBy: 1 },
  { id: 17, name: 'KY', createdBy: 1, updatedBy: 1 },
  { id: 18, name: 'LA', createdBy: 1, updatedBy: 1 },
  { id: 19, name: 'ME', createdBy: 1, updatedBy: 1 },
  { id: 20, name: 'MD', createdBy: 1, updatedBy: 1 },
  { id: 21, name: 'MA', createdBy: 1, updatedBy: 1 },
  { id: 22, name: 'MI', createdBy: 1, updatedBy: 1 },
  { id: 23, name: 'MN', createdBy: 1, updatedBy: 1 },
  { id: 24, name: 'MS', createdBy: 1, updatedBy: 1 },
  { id: 25, name: 'MO', createdBy: 1, updatedBy: 1 },
  { id: 26, name: 'MT', createdBy: 1, updatedBy: 1 },
  { id: 27, name: 'NE', createdBy: 1, updatedBy: 1 },
  { id: 28, name: 'NV', createdBy: 1, updatedBy: 1 },
  { id: 29, name: 'NH', createdBy: 1, updatedBy: 1 },
  { id: 30, name: 'NJ', createdBy: 1, updatedBy: 1 },
  { id: 31, name: 'NM', createdBy: 1, updatedBy: 1 },
  { id: 32, name: 'NY', createdBy: 1, updatedBy: 1 },
  { id: 33, name: 'NC', createdBy: 1, updatedBy: 1 },
  { id: 34, name: 'ND', createdBy: 1, updatedBy: 1 },
  { id: 35, name: 'OH', createdBy: 1, updatedBy: 1 },
  { id: 36, name: 'OK', createdBy: 1, updatedBy: 1 },
  { id: 37, name: 'OR', createdBy: 1, updatedBy: 1 },
  { id: 38, name: 'PA', createdBy: 1, updatedBy: 1 },
  { id: 39, name: 'RI', createdBy: 1, updatedBy: 1 },
  { id: 40, name: 'SC', createdBy: 1, updatedBy: 1 },
  { id: 41, name: 'SD', createdBy: 1, updatedBy: 1 },
  { id: 42, name: 'TN', createdBy: 1, updatedBy: 1 },
  { id: 43, name: 'TX', createdBy: 1, updatedBy: 1 },
  { id: 44, name: 'UT', createdBy: 1, updatedBy: 1 },
  { id: 45, name: 'VT', createdBy: 1, updatedBy: 1 },
  { id: 46, name: 'VA', createdBy: 1, updatedBy: 1 },
  { id: 47, name: 'WA', createdBy: 1, updatedBy: 1 },
  { id: 48, name: 'WV', createdBy: 1, updatedBy: 1 },
  { id: 49, name: 'WI', createdBy: 1, updatedBy: 1 },
  { id: 50, name: 'WY', createdBy: 1, updatedBy: 1 },
  { id: 51, name: 'PR', createdBy: 1, updatedBy: 1 },
];

async function loadStateData() {
  try {
    logger.info('Seeding StateData...');

    await Promise.all(
      states.map(async (state) => {
        if (state.name) {
          await prisma.state.upsert({
            where: { id: state.id },
            update: {},
            create: {
              name: state.name,
              createdBy: state.createdBy,
              updatedBy: state.updatedBy,
            },
          });
        }
      }),
    );

    logger.info('state seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadStateData();
