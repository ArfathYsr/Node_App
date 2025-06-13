BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AddressType] ADD [Name] VARCHAR(255) NOT NULL CONSTRAINT [AddressType_Name_df] DEFAULT 'Home';

-- CreateTable
CREATE TABLE [dbo].[City] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [City_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL CONSTRAINT [City_CreatedBy_df] DEFAULT 0,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [City_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL CONSTRAINT [City_UpdatedBy_df] DEFAULT 0,
    [Name] VARCHAR(255) NOT NULL,
    CONSTRAINT [City_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[State] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [State_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [State_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    CONSTRAINT [State_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[profileEmailAddress] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [EmailAddress] VARCHAR(255) NOT NULL,
    [IsPrimary] BIT NOT NULL,
    [UpdatedBy] INT NOT NULL CONSTRAINT [profileEmailAddress_UpdatedBy_df] DEFAULT 0,
    [CreatedBy] INT NOT NULL CONSTRAINT [profileEmailAddress_CreatedBy_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [profileEmailAddress_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [profileEmailAddress_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [profileEmailAddress_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ProfileAddressDetails] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileAddressDetails_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [AddressTypeId] INT NOT NULL,
    [Address] VARCHAR(255) NOT NULL,
    [EmailAddress] VARCHAR(255) NOT NULL,
    [CityId] INT NOT NULL,
    [StateId] INT NOT NULL,
    [Zipcode] VARCHAR(40) NOT NULL,
    [PoBox] VARCHAR(40) NOT NULL,
    [IsActive] BIT NOT NULL,
    [IsPrimary] BIT NOT NULL,
    [TimeZoneId] INT NOT NULL,
    [LocaleId] INT NOT NULL,
    [EmailAddressId] INT NOT NULL,
    CONSTRAINT [ProfileAddressDetails_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[profileEmailAddress] ADD CONSTRAINT [profileEmailAddress_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_AddressTypeId_fkey] FOREIGN KEY ([AddressTypeId]) REFERENCES [dbo].[AddressType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_CityId_fkey] FOREIGN KEY ([CityId]) REFERENCES [dbo].[City]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_StateId_fkey] FOREIGN KEY ([StateId]) REFERENCES [dbo].[State]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_TimeZoneId_fkey] FOREIGN KEY ([TimeZoneId]) REFERENCES [dbo].[TimeZone]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_LocaleId_fkey] FOREIGN KEY ([LocaleId]) REFERENCES [dbo].[locale]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_EmailAddressId_fkey] FOREIGN KEY ([EmailAddressId]) REFERENCES [dbo].[profileEmailAddress]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddressDetails] ADD CONSTRAINT [ProfileAddressDetails_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
