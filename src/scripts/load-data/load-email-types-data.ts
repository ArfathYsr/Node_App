import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const emailTypes = [{ name: 'default' }];

async function loadEmailTypes() {
  try {
    logger.info('Running seed loadEmailTypes');

    const existingEmailTypes = await prisma.emailAddressType.findMany();

    const nonExistingEmailTypes = emailTypes.filter(
      (emailType) =>
        !existingEmailTypes.some(({ name }) => emailType.name === name),
    );

    await prisma.emailAddressType.createMany({
      data: nonExistingEmailTypes.map(({ name }) => ({ name, isActive: true })),
    });

    logger.info('Inserted successfully');
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadEmailTypes();
