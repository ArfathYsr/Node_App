import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const Prisma = new PrismaClient();

async function loadMenuData() {
  try {
    logger.info('Deleting existing menus and their permissions...');

    logger.info('Adding parent menu data...');
    const parentMenus = [
      {
        name: 'Home',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Global Settings',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Client Settings',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Profiles',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Reports',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Budget',
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Vendor Master Profile',
        createdBy: 1,
        updatedBy: 1,
      },
    ];

    await Prisma.$transaction(async (prisma) => {
      for (const menu of parentMenus) {
        await prisma.menu.upsert({
          where: {
            name: menu.name,
          },
          update:{},
          create: {
            name: menu.name,
            createdBy: menu.createdBy,
            updatedBy: menu.updatedBy,
          },
        });
      }
    });

    logger.info('Menu data seeded successfully.');
  } catch (error) {
    logger.error('Error seeding menu data:', error);
    throw error;
  } finally {
    await Prisma.$disconnect();
  }
}

loadMenuData();
