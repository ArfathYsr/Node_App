import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const roleCriteria = [
  {
    roleCriteriaName: 'Does the role have a tier?',
    createdBy: 1,
    updatedBy: 1,
    isActive: true,
  },
  {
    roleCriteriaName: 'Does the role have a classification?',
    createdBy: 1,
    updatedBy: 1,
    isActive: true,
  },
  {
    roleCriteriaName: 'Is a contract required for this role?',
    createdBy: 1,
    updatedBy: 1,
    isActive: true,
  },
  {
    roleCriteriaName: 'Is training required for this role ?',
    createdBy: 1,
    updatedBy: 1,
    isActive: true,
  },
];

async function loadRoleCriteriaData() {
  try {
    logger.info('Seeding RoleCriteriaData...');

    await Promise.all(
      roleCriteria.map(async (rcr) => {
        await prisma.roleCriteria.upsert({
          where: { roleCriteriaName: rcr.roleCriteriaName },
          update: {},
          create: {
            roleCriteriaName: rcr.roleCriteriaName,
            createdBy: rcr.createdBy,
            updatedBy: rcr.updatedBy,
            isActive: rcr.isActive,
          },
        });
      }),
    );

    logger.info('RoleCriteriaData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadRoleCriteriaData();
