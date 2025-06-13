import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const questionValidations = [
  {
    id: 1,
    question: 'Upload',
    questionCategory: 'Meeting Rooms',
    typeField: 'FileSize',
    typeValue: '25MB',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 2,
    question: 'Upload',
    questionCategory: 'Meeting Rooms',
    typeField: 'FileFormat',
    typeValue: 'SVG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 3,
    question: 'Upload',
    questionCategory: 'Meeting Rooms',
    typeField: 'FileFormat',
    typeValue: 'PNG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 4,
    question: 'Upload',
    questionCategory: 'Meeting Rooms',
    typeField: 'FileFormat',
    typeValue: 'JPG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 5,
    question: 'Upload',
    questionCategory: 'Menu and Cost',
    typeField: 'FileSize',
    typeValue: '25MB',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 6,
    question: 'Upload',
    questionCategory: 'Menu and Cost',
    typeField: 'FileFormat',
    typeValue: 'SVG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 7,
    question: 'Upload',
    questionCategory: 'Menu and Cost',
    typeField: 'FileFormat',
    typeValue: 'PNG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 8,
    question: 'Upload',
    questionCategory: 'Menu and Cost',
    typeField: 'FileFormat',
    typeValue: 'JPG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 9,
    question: 'Upload your contract files',
    questionCategory: 'Contract and Policies',
    typeField: 'FileSize',
    typeValue: '25MB',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 10,
    question: 'Upload your contract files',
    questionCategory: 'Contract and Policies',
    typeField: 'FileFormat',
    typeValue: 'SVG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 11,
    question: 'Upload your contract files',
    questionCategory: 'Contract and Policies',
    typeField: 'FileFormat',
    typeValue: 'PNG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 12,
    question: 'Upload your contract files',
    questionCategory: 'Contract and Policies',
    typeField: 'FileFormat',
    typeValue: 'JPG',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function getQuestionIdByQuestion(
  questionText: string | null,
  questionCategoryId: number,
) {
  if (!questionText || questionText === null) return null;
  const questionId = await prisma.question.findFirst({
    where: { question: questionText, questionCategoryId },
  });
  return questionId?.id || null;
}

async function getTypeValidationIdByText(typeField: string, typeValue: string) {
  if (!typeField || typeField === null || !typeValue || typeValue === null)
    return null;
  const typeValidationId = await prisma.typeValidation.findFirst({
    where: { typeField, typeValue },
  });
  return typeValidationId?.id || null;
}

async function getCategoryIdByName(name: string) {
  const category = await prisma.questionCategory.findFirst({ where: { name } });
  return category?.id || null;
}

async function loadQuestionValidationData() {
  try {
    logger.info('Seeding QuestionValidationData...');

    for (const data of questionValidations) {
      const questionCategoryId = await getCategoryIdByName(
        data.questionCategory,
      );
      if (!questionCategoryId) {
        logger.warn(`Skipping question ID ${data.id} due to missing category.`);
        continue;
      }

      const questionId = await getQuestionIdByQuestion(
        data.question,
        questionCategoryId,
      );
      const typeValidationId = await getTypeValidationIdByText(
        data.typeField,
        data.typeValue,
      );

      if (!questionId || !typeValidationId) {
        logger.warn(
          `Skipping question Option ID ${data.id} due to missing question or Type Validation`,
        );
        continue;
      }

      await prisma.questionValidation.upsert({
        where: { id: data.id },
        update: {
          questionId,
          typeValidationId,
          updatedBy: data.updatedBy,
        },
        create: {
          questionId,
          typeValidationId,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
        },
      });
    }

    logger.info('QuestionValidationData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadQuestionValidationData();
