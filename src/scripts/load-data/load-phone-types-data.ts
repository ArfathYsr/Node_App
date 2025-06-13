import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();
deletePhoneTypeByName('Home');
deletePhoneTypeByName('Work');
const phoneTypes = [
  {
    name: 'Landline',
    isActive: true,
  },

  {
    name: 'Mobile',
    isActive: true,
  },
  {
    name: 'Office',
    isActive: true,
  },
];

async function loadPhoneTypesData() {
  try {
    logger.info('Seeding PhoneTypes...');

    await Promise.all(
      phoneTypes.map(async (phoneType) => {
        if (phoneType.name) {
          await prisma.phoneType.upsert({
            where: { name: phoneType.name },
            update: {},
            create: {
              name: phoneType.name,
              isActive: phoneType.isActive,
            },
          });
        }
      }),
    );

    logger.info('phoneType seeded successfully.');
  } catch (error) {
    logger.error('Error in inserting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
async function deletePhoneTypeByName(name: string): Promise<void> {
  try {
    const phoneType = await prisma.phoneType.findUnique({
      where: { name: name },
      select: { id: true },
    });

    if (!phoneType) {
      logger.info(`PhoneType with name '${name}' not found.`);
      return;
    }

    // Delete dependent records
    await prisma.profilePhoneInfo.deleteMany({
      where: { phoneTypeId: phoneType.id },
    });

    // Delete the phone type
    await prisma.phoneType.delete({
      where: { id: phoneType.id },
    });

    logger.info(`PhoneType with name '${name}' has been deleted.`);
  } catch (error) {
    logger.error(`Failed to delete PhoneType with name '${name}':`, error);
  }
}
loadPhoneTypesData();
