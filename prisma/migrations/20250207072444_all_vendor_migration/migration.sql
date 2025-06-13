BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AddressType] ADD [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [AddressType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
[CreatedBy] INT NOT NULL CONSTRAINT [AddressType_CreatedBy_df] DEFAULT 0,
[UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [AddressType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
[UpdatedBy] INT NOT NULL CONSTRAINT [AddressType_UpdatedBy_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Country] ADD [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Country_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
[CreatedBy] INT NOT NULL CONSTRAINT [Country_CreatedBy_df] DEFAULT 0,
[UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Country_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
[UpdatedBy] INT NOT NULL CONSTRAINT [Country_UpdatedBy_df] DEFAULT 0;

-- CreateTable
CREATE TABLE [dbo].[VendorType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL CONSTRAINT [VendorType_CreatedBy_df] DEFAULT 0,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL CONSTRAINT [VendorType_UpdatedBy_df] DEFAULT 0,
    CONSTRAINT [VendorType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ContactType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContactType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL CONSTRAINT [ContactType_CreatedBy_df] DEFAULT 0,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ContactType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL CONSTRAINT [ContactType_UpdatedBy_df] DEFAULT 0,
    CONSTRAINT [ContactType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Vendor] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [VendorTypeID] INT NOT NULL,
    [IsAlsoCaterer] BIT NOT NULL CONSTRAINT [Vendor_IsAlsoCaterer_df] DEFAULT 0,
    [StartDate] DATETIME2,
    [EndDate] DATETIME2,
    [AdditionalInformation] TEXT,
    [DBA] VARCHAR(255),
    [WebsiteURL] VARCHAR(255),
    [FacebookURL] VARCHAR(255),
    [InstagramURL] VARCHAR(255),
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Vendor_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Vendor_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Vendor_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[VendorAddressDetails] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [VendorID] INT NOT NULL,
    [AddressTypeID] INT NOT NULL,
    [Address] VARCHAR(255) NOT NULL,
    [CityID] INT NOT NULL,
    [StateID] INT NOT NULL,
    [CountryID] INT NOT NULL,
    [ZipCode] VARCHAR(20),
    [EmailAddress] VARCHAR(255),
    [PhoneNumber] VARCHAR(20),
    [IsDefault] BIT NOT NULL CONSTRAINT [VendorAddressDetails_IsDefault_df] DEFAULT 0,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorAddressDetails_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorAddressDetails_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VendorAddressDetails_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[VendorContactDetails] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [VendorID] INT NOT NULL,
    [ContactTypeID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [PhoneNumber] VARCHAR(20),
    [EmailAddress] VARCHAR(255),
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorContactDetails_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorContactDetails_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VendorContactDetails_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientVendors] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ClientID] INT NOT NULL,
    [VendorID] INT NOT NULL,
    [RelationshipStatus] VARCHAR(50) NOT NULL,
    [StartDate] DATETIME2,
    [EndDate] DATETIME2,
    [AdditionalNotes] TEXT,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientVendors_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientVendors_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ClientVendors_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Vendor] ADD CONSTRAINT [Vendor_VendorTypeID_fkey] FOREIGN KEY ([VendorTypeID]) REFERENCES [dbo].[VendorType]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Vendor] ADD CONSTRAINT [Vendor_CreatedBy_fkey] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Vendor] ADD CONSTRAINT [Vendor_UpdatedBy_fkey] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAddressDetails] ADD CONSTRAINT [VendorAddressDetails_VendorID_fkey] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAddressDetails] ADD CONSTRAINT [VendorAddressDetails_AddressTypeID_fkey] FOREIGN KEY ([AddressTypeID]) REFERENCES [dbo].[AddressType]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAddressDetails] ADD CONSTRAINT [VendorAddressDetails_CityID_fkey] FOREIGN KEY ([CityID]) REFERENCES [dbo].[City]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAddressDetails] ADD CONSTRAINT [VendorAddressDetails_StateID_fkey] FOREIGN KEY ([StateID]) REFERENCES [dbo].[State]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAddressDetails] ADD CONSTRAINT [VendorAddressDetails_CountryID_fkey] FOREIGN KEY ([CountryID]) REFERENCES [dbo].[Country]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorContactDetails] ADD CONSTRAINT [VendorContactDetails_VendorID_fkey] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorContactDetails] ADD CONSTRAINT [VendorContactDetails_ContactTypeID_fkey] FOREIGN KEY ([ContactTypeID]) REFERENCES [dbo].[ContactType]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientVendors] ADD CONSTRAINT [ClientVendors_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientVendors] ADD CONSTRAINT [ClientVendors_VendorID_fkey] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
