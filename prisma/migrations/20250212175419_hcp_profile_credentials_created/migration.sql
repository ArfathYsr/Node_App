/*
  Warnings:

  - You are about to drop the column `ProfileBioProfessionalCredentialsId` on the `ProfileAddressDetails` table. All the data in the column will be lost.
  - You are about to drop the `ProfileBioProfessionalCredentials` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] DROP CONSTRAINT [ProfileAddressDetails_ProfileBioProfessionalCredentialsId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileBioProfessionalCredentials] DROP CONSTRAINT [ProfileBioProfessionalCredentials_ProfileID_fkey];

-- AlterTable
ALTER TABLE [dbo].[ProfileAddressDetails] DROP COLUMN [ProfileBioProfessionalCredentialsId];

-- DropTable
DROP TABLE [dbo].[ProfileBioProfessionalCredentials];

-- CreateTable
CREATE TABLE [dbo].[Specialty] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Specialty_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Specialty_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [Specialty_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Specialty_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[Degree] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Degree_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Degree_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [Degree_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Degree_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[AffiliationType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [AffiliationType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [AffiliationType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [AffiliationType_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [AffiliationType_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalLicenseState] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseState_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseState_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [MedicalLicenseState_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [MedicalLicenseState_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalLicenseType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [MedicalLicenseType_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [MedicalLicenseType_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalLicenseJurisdictions] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseJurisdictions_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseJurisdictions_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [MedicalLicenseJurisdictions_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [MedicalLicenseJurisdictions_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalLicenseStatus] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseStatus_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [MedicalLicenseStatus_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [MedicalLicenseStatus_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [MedicalLicenseStatus_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[HcpBioProfessional] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [RoleID] INT,
    [PrimaryDegreeID] INT NOT NULL,
    [SecondaryDegreeID] INT,
    [MedicalLicenseJurisdictionsID] INT NOT NULL,
    [MedicalLicenseNumber] NVARCHAR(1000) NOT NULL,
    [MedicalLicenseEffectiveDate] DATETIME2 NOT NULL,
    [MedicalLicenseExpiryDate] DATETIME2 NOT NULL,
    [MedicalLicenseTypeID] INT NOT NULL,
    [MedicalLicenseStatusID] INT NOT NULL,
    [MedicalLicenseStateID] INT NOT NULL,
    [AffiliationTypeID] INT,
    [AffiliationName] NVARCHAR(1000),
    [PrimarySpecialtyID] INT NOT NULL,
    [SecondarySpecialtyID] INT,
    [NPI] NVARCHAR(1000),
    [AcademicInstitutionTitle] NVARCHAR(1000),
    [IsVAorDoD] BIT,
    [IsGovernmentEmployee] BIT,
    [IsHcpPrescriber] BIT NOT NULL,
    [IsMedicalSpeaker] BIT,
    [IsMedicalFellow] BIT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [HcpBioProfessional_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [HcpBioProfessional_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [HcpBioProfessional_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_RoleID_fkey] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_PrimaryDegreeID_fkey] FOREIGN KEY ([PrimaryDegreeID]) REFERENCES [dbo].[Degree]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_SecondaryDegreeID_fkey] FOREIGN KEY ([SecondaryDegreeID]) REFERENCES [dbo].[Degree]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_MedicalLicenseJurisdictionsID_fkey] FOREIGN KEY ([MedicalLicenseJurisdictionsID]) REFERENCES [dbo].[MedicalLicenseJurisdictions]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_MedicalLicenseTypeID_fkey] FOREIGN KEY ([MedicalLicenseTypeID]) REFERENCES [dbo].[MedicalLicenseType]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_MedicalLicenseStatusID_fkey] FOREIGN KEY ([MedicalLicenseStatusID]) REFERENCES [dbo].[MedicalLicenseStatus]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_MedicalLicenseStateID_fkey] FOREIGN KEY ([MedicalLicenseStateID]) REFERENCES [dbo].[MedicalLicenseState]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_AffiliationTypeID_fkey] FOREIGN KEY ([AffiliationTypeID]) REFERENCES [dbo].[AffiliationType]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_PrimarySpecialtyID_fkey] FOREIGN KEY ([PrimarySpecialtyID]) REFERENCES [dbo].[Specialty]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[HcpBioProfessional] ADD CONSTRAINT [HcpBioProfessional_SecondarySpecialtyID_fkey] FOREIGN KEY ([SecondarySpecialtyID]) REFERENCES [dbo].[Specialty]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
