import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const questionCategorys = [
  {
    name: 'Meeting Rooms',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Venue Details',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Audio Visual',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Menu and Cost',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Contract and Policies',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadQuestionCategoryData() {
  try {
    logger.info('Seeding QuestionCategoryData...');

    for (const data of questionCategorys) {
      if (data.name) {
        await prisma.questionCategory.upsert({
          where: { name: data.name },
          update: {
            name: data.name,
            isActive: data.isActive,
            updatedBy: data.updatedBy,
          },
          create: {
            name: data.name,
            isActive: data.isActive,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
          },
        });
      }
    }

    logger.info('QuestionCategoryData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadQuestionCategoryData();
