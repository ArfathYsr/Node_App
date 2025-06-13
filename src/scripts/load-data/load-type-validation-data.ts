import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const typeValidations = [
  {
    id: 1,
    typeField: 'FileSize',
    typeValue: '25MB',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 2,
    typeField: 'FileFormat',
    typeValue: 'SVG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 3,
    typeField: 'FileFormat',
    typeValue: 'PNG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 4,
    typeField: 'FileFormat',
    typeValue: 'JPG',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 5,
    typeField: 'TextLength',
    typeValue: '255',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadTypeValidationData() {
  try {
    logger.info('Seeding TypeValidationData...');

    for (const data of typeValidations) {
      await prisma.typeValidation.upsert({
        where: { id: data.id },
        update: {
          typeField: data.typeField,
          typeValue: data.typeValue,
          updatedBy: data.updatedBy,
        },
        create: {
          typeField: data.typeField,
          typeValue: data.typeValue,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
        },
      });
    }

    logger.info('TypeValidationData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadTypeValidationData();
