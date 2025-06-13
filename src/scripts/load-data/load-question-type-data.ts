import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const questionTypes = [
  {
    name: 'Radio',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Checkbox',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'File Upload',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Dropdown',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Textbox',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Textarea',
    isActive: true,
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadQuestionTypeData() {
  try {
    logger.info('Seeding QuestionTypeData...');

    for (const data of questionTypes) {
      if (data.name) {
        await prisma.questionType.upsert({
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

    logger.info('QuestionTypeData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadQuestionTypeData();
