import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

async function loadProfileData() {
  const emailAddressType = await prisma.emailAddressType.findFirst({
    where: { name: 'default' },
  });
  if (!emailAddressType) {
    throw new Error(`Email default is not defined`);
  }
  const relationTables = [
    {
      currentTable: 'permission',
      fieldName: 'permissionGroupIds',
      relationTable: 'permissionGroupPermission',
      masterTable: 'permissionGroup',
    },
    {
      currentTable: 'permission',
      fieldName: 'roleIds',
      relationTable: 'rolePermission',
      masterTable: 'role',
    },
    {
      currentTable: 'permission',
      fieldName: 'menuIds',
      relationTable: 'permissionMenu',
      masterTable: 'menu',
    },
    {
      currentTable: 'permission',
      fieldName: 'subMenuIds',
      relationTable: 'permissionMenu',
      masterTable: 'menu',
    },
    {
      currentTable: 'permissionGroup',
      fieldName: 'roleIds',
      relationTable: 'rolePermissionGroup',
      masterTable: 'role',
    },
    {
      currentTable: 'permissionGroup',
      fieldName: 'permissionIds',
      relationTable: 'permissionGroupPermission',
      masterTable: 'permission',
    },
    {
      currentTable: 'functionalArea',
      fieldName: 'clientIds',
      relationTable: 'clientFunctionalArea',
      masterTable: 'client',
    },
    {
      currentTable: 'role',
      fieldName: 'clientIds',
      relationTable: 'roleClient',
      masterTable: 'client',
    },
    {
      currentTable: 'role',
      fieldName: 'permissionIds',
      relationTable: 'rolePermission',
      masterTable: 'permission',
    },
    {
      currentTable: 'role',
      fieldName: 'permissionGroupIds',
      relationTable: 'rolePermissionGroup',
      masterTable: 'permissionGroup',
    },
    {
      currentTable: 'profile',
      fieldName: 'clientIds',
      relationTable: 'profileClient',
      masterTable: 'client',
    },
    {
      currentTable: 'profile',
      fieldName: 'functionalAreaIds',
      relationTable: 'profileFunctionalArea',
      masterTable: 'functionalArea',
    },
    {
      currentTable: 'profile',
      fieldName: 'permissionIds',
      relationTable: 'profilePermission',
      masterTable: 'permission',
    },
    {
      currentTable: 'profile',
      fieldName: 'permissionGroupIds',
      relationTable: 'profilePermissionGroup',
      masterTable: 'permissionGroup',
    },
    {
      currentTable: 'profile',
      fieldName: 'roleIds',
      relationTable: 'profileRole',
      masterTable: 'role',
    },
    {
      currentTable: 'profile',
      fieldName: 'localeId',
      relationTable: '',
      masterTable: 'locale',
    },
    {
      currentTable: 'profile',
      fieldName: 'timezoneId',
      relationTable: '',
      masterTable: 'timeZone',
    },
    {
      currentTable: 'client',
      fieldName: 'therapeuticAreaId',
      relationTable: 'clientTherapeuticArea',
      masterTable: 'therapeuticArea',
    },
    {
      currentTable: 'permission',
      fieldName: 'clientIds',
      relationTable: 'ClientPermission',
      masterTable: 'client',
    },
  ];

  try {
    logger.info('Running seed for relation table');
    await Promise.all(
      relationTables.map(async (relationTable) => {
        const existingRecord = await prisma.tableRelation.findFirst({
          where: {
            currentTable: relationTable.currentTable,
            fieldName: relationTable.fieldName,
          },
        });

        await prisma.tableRelation.upsert({
          where: {
            id: existingRecord ? existingRecord.id : 0, // assuming id is unique
          },
          update: {},
          create: {
            currentTable: relationTable.currentTable,
            fieldName: relationTable.fieldName,
            relationTable: relationTable.relationTable,
            masterTable: relationTable.masterTable,
          },
        });
      }),
    );

    logger.info('Inserted all relationTables successfully');
  } catch (error) {
    logger.error('Error inserting relationTables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadProfileData();
