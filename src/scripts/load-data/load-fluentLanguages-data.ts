import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const fluentLanguages = [
  {
    name: 'English',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Spanish',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Hindi',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'German',
    createdBy: 1,
    updatedBy: 1,
  },
];

async function loadFluentLanguagesData() {
  try {
    logger.info('Seeding FluentLanguagesData...');

    await Promise.all(
      fluentLanguages.map(async (fluentLanguage) => {
        if (fluentLanguage.name) {
          await prisma.fluentLanguages.upsert({
            where: { name: fluentLanguage.name },
            update: {},
            create: {
              name: fluentLanguage.name,
              createdBy: fluentLanguage.createdBy,
              updatedBy: fluentLanguage.updatedBy,
            },
          });
        }
      }),
    );

    logger.info('FluentLanguagesData seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadFluentLanguagesData();
