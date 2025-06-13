import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const questionOptions = [
  {
    id: 1,
    question: 'What is the table setup in the room?',
    option: 'Classroom',
    isActive: true,
    DisplayOrder: 1,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 2,
    question: 'What is the table setup in the room?',
    option: 'Conference',
    isActive: true,
    DisplayOrder: 2,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 3,
    question: 'Please select which days will the venue be closed',
    option: 'Sun',
    isActive: true,
    DisplayOrder: 1,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 4,
    question: 'Please select which days will the venue be closed',
    option: 'Mon',
    isActive: true,
    DisplayOrder: 2,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 5,
    question: 'Please select which days will the venue be closed',
    option: 'Tue',
    isActive: true,
    DisplayOrder: 3,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 6,
    question: 'Please select which days will the venue be closed',
    option: 'Wed',
    isActive: true,
    DisplayOrder: 4,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 7,
    question: 'Please select which days will the venue be closed',
    option: 'Thu',
    isActive: true,
    DisplayOrder: 5,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 8,
    question: 'Please select which days will the venue be closed',
    option: 'Fri',
    isActive: true,
    DisplayOrder: 6,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 9,
    question: 'Please select which days will the venue be closed',
    option: 'Sat',
    isActive: true,
    DisplayOrder: 7,
    createdBy: 1,
    updatedBy: 1,
  },
];

async function getQuestionIdByQuestion(questionText: string | null) {
  if (!questionText || questionText === null) return null;
  const questionId = await prisma.question.findFirst({
    where: { question: questionText },
  });
  return questionId?.id || null;
}

async function loadQuestionOptionsData() {
  try {
    logger.info('Seeding QuestionOptionsData...');

    for (const data of questionOptions) {
      const questionId = await getQuestionIdByQuestion(data.question);

      if (!questionId) {
        logger.warn(
          `Skipping question Option ID ${data.id} due to missing question.`,
        );
        continue;
      }
      await prisma.questionOption.upsert({
        where: { id: data.id },
        update: {
          questionId,
          option: data.option,
          isActive: data.isActive,
          displayOrder: data.DisplayOrder,
          updatedBy: data.updatedBy,
        },
        create: {
          questionId,
          option: data.option,
          isActive: data.isActive,
          displayOrder: data.DisplayOrder,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
        },
      });
    }

    logger.info('QuestionOptionsData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadQuestionOptionsData();
