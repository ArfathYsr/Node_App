import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

async function loadBioProfeesionLookupData() {
  const transaction = await prisma.$transaction(async () => {
    try {
      logger.info('Running seed BioProfeesionLookupData');

      // Data for upsert
      const degreeData = [
        { name: 'MD' },
        { name: 'MS' },
        { name: 'BSN' },
        { name: 'DMD' },
      ];

      const specialtyData = [
        { name: 'Cardiology' },
        { name: 'Oncology' },
        { name: 'Psychiatry' },
        { name: 'Neurology' },
      ];

      const medicalLicenseStateData = [
        { name: 'en-US' },
        { name: 'fr-FR' },
        { name: 'es-ES' },
        { name: 'de-DE' },
        { name: 'it-IT' },
        { name: 'ja-JP' },
        { name: 'zh-CN' },
        { name: 'hi-IN' },
        { name: 'pt-BR' },
        { name: 'ru-RU' },
      ];

      const medicalLicenseTypeData = [
        { name: 'Full License' },
        { name: 'Provisional License' },
        { name: 'Temporary License' },
        { name: 'Special License' },
        { name: 'Limited License' },
      ];

      const medicalLicenseJurisdictionsData = [
        { name: 'California' },
        { name: 'New York' },
        { name: 'Texas' },
        { name: 'Florida' },
        { name: 'Illinois' },
      ];

      const segmentationData = [
        { name: 'Pediatrics' },
        { name: 'Cardiology' },
        { name: 'Neurology' },
        { name: 'Oncology' },
        { name: 'Dermatology' },
      ];

      const affiliationTypeData = [
        { name: 'Hospital' },
        { name: 'Clinic' },
        { name: 'Private Practice' },
        { name: 'Research Institution' },
        { name: 'Government Agency' },
      ];

      const medicalLicenseStatusData = [
        { name: 'Active' },
        { name: 'Inactive' },
        { name: 'Suspended' },
        { name: 'Revoked' },
        { name: 'Expired' },
      ];

      // Upsert operation for all tables
      await Promise.all([
        // Degree table
        ...degreeData.map(async (item) => {
          await prisma.degree.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),

        // Specialty table
        ...specialtyData.map(async (item) => {
          await prisma.specialty.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),

        // Medical License State
        ...medicalLicenseStateData.map(async (item) => {
          await prisma.medicalLicenseState.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),

        // Medical License Type
        ...medicalLicenseTypeData.map(async (item) => {
          await prisma.medicalLicenseType.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),

        // Medical License Jurisdictions
        ...medicalLicenseJurisdictionsData.map(async (item) => {
          await prisma.medicalLicenseJurisdictions.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),

        // Segmentation table
        ...segmentationData.map(async (item) => {
          await prisma.segmentation.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),

        // Affiliation Type table
        ...affiliationTypeData.map(async (item) => {
          await prisma.affiliationType.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),

        // Medical License Status
        ...medicalLicenseStatusData.map(async (item) => {
          await prisma.medicalLicenseStatus.upsert({
            where: { name: item.name },
            update: {},
            create: {
              createdBy: 1,
              updatedBy: 1,
              name: item.name,
            },
          });
        }),
      ]);

      logger.info('Professional data upserted successfully');
    } catch (error) {
      logger.error('Error inserting data:', error);
      throw error;
    }
  });

  await transaction;
}

loadBioProfeesionLookupData();
