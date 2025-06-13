import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const Prisma = new PrismaClient();

async function loadSubMenuData() {
  try {
    logger.info('Adding sub menu data...');

    // Get parent menus with error handling
    const parentMenuRecords = await Prisma.menu.findMany({
      where: {
        name: { in: ['Home', 'Global Settings'] },
      },
    });

    const parentMenuId1 = parentMenuRecords.find(
      (pm) => pm.name === 'Home',
    )?.id;
    const parentMenuId2 = parentMenuRecords.find(
      (pm) => pm.name === 'Global Settings',
    )?.id;

    if (!parentMenuId1 || !parentMenuId2) {
      throw new Error('Parent menus not found - run parent menu seeding first');
    }

    const subMenus = [
      {
        name: 'Home Sub Menu 1-1',
        parentMenuId: parentMenuId1,
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Home Sub Menu 1-2',
        parentMenuId: parentMenuId1,
        createdBy: 1,
        updatedBy: 1,
      },
      {
        name: 'Global Settings Sub Menu 2-1',
        parentMenuId: parentMenuId2,
        createdBy: 1,
        updatedBy: 1,
      },
    ];

    // Use transaction for atomic operations
    await Prisma.$transaction(async (prisma) => {
      for (const menu of subMenus) {
        await prisma.menu.upsert({
          where: {
            name: menu.name,
          },
          update:{},
          create: {
            name: menu.name,
            parentMenuId: menu.parentMenuId,
            createdBy: menu.createdBy,
            updatedBy: menu.updatedBy,
          },
        });
      }
    });

    logger.info('Submenu seeded successfully.');
  } catch (error) {
    logger.error('Error inserting submenu data:', error);
    throw error;
  } finally {
    await Prisma.$disconnect();
  }
}

loadSubMenuData();
