BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ProfileAddressDetails] ALTER COLUMN [EmailAddress] VARCHAR(255) NULL;
ALTER TABLE [dbo].[ProfileAddressDetails] ALTER COLUMN [PoBox] VARCHAR(40) NULL;
ALTER TABLE [dbo].[ProfileAddressDetails] ALTER COLUMN [TimeZoneId] INT NULL;
ALTER TABLE [dbo].[ProfileAddressDetails] ALTER COLUMN [LocaleId] INT NULL;
ALTER TABLE [dbo].[ProfileAddressDetails] ALTER COLUMN [EmailAddressId] INT NULL;
ALTER TABLE [dbo].[ProfileAddressDetails] ADD [ProfileBioProfessionalCredentialsId] INT;

-- CreateTable
CREATE TABLE [dbo].[ProfileBioProfessionalCredentials] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [StateLicenceNumber] NVARCHAR(1000) NOT NULL,
    [StateLicenceExpiryDate] DATETIME2 NOT NULL,
    [Npi] NVARCHAR(1000) NOT NULL,
    [Decile] NVARCHAR(1000) NOT NULL,
    [InstitutionalReference] NVARCHAR(1000) NOT NULL,
    [NpiTaxonomy] NVARCHAR(1000) NOT NULL,
    [CreatedBy] INT NOT NULL CONSTRAINT [ProfileBioProfessionalCredentials_CreatedBy_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileBioProfessionalCredentials_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL CONSTRAINT [ProfileBioProfessionalCredentials_UpdatedBy_df] DEFAULT 0,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileBioProfessionalCredentials_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ProfileBioProfessionalCredentials_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_ProfileBioProfessionalCredentialsId_fkey] FOREIGN KEY ([ProfileBioProfessionalCredentialsId]) REFERENCES [dbo].[ProfileBioProfessionalCredentials]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileBioProfessionalCredentials] ADD CONSTRAINT [ProfileBioProfessionalCredentials_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
