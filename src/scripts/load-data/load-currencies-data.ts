import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

const currencies = [{ name: 'US Dollar', code: 'USD' }];

async function loadCurrenciesData() {
  try {
    logger.info('Running seed loadCurrenciesData');
    await Promise.all(
      currencies.map(async (currency) => {
        await prisma.currency.upsert({
          where: { currencyCode: currency.code },
          update: {},
          create: {
            name: currency.name,
            currencyCode: currency.code,
            createdBy: 1,
            updatedBy: 1,
            isActive: true,
          },
        });
      }),
    );
    logger.info('Inserted successfully');
  } catch (error) {
    logger.error('Error inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadCurrenciesData();
