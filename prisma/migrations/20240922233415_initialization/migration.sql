BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Theme] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Theme_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Theme_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [PrimaryColor] CHAR(7) NOT NULL,
    [SecondaryColor] CHAR(7) NOT NULL,
    [HeaderColor] CHAR(7) NOT NULL,
    [BackgroundColor] CHAR(7) NOT NULL,
    [TextColor] CHAR(7) NOT NULL,
    [LinkColor] CHAR(7) NOT NULL,
    [PILinkColor] CHAR(7) NOT NULL,
    [IconColor] CHAR(7) NOT NULL,
    CONSTRAINT [Theme_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[App] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [App_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [App_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    CONSTRAINT [App_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[AppTheme] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [AppID] INT NOT NULL,
    [ThemeID] INT NOT NULL,
    CONSTRAINT [AppTheme_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Currency] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Currency_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Currency_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] NVARCHAR(30) NOT NULL,
    [CurrencyCode] NVARCHAR(6) NOT NULL,
    CONSTRAINT [Currency_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Currency_CurrencyCode_key] UNIQUE NONCLUSTERED ([CurrencyCode])
);

-- CreateTable
CREATE TABLE [dbo].[ClientStatus] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientStatus_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientStatus_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [Name] VARCHAR(30) NOT NULL,
    CONSTRAINT [ClientStatus_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ClientStatus_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[Client] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Client_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Client_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [ClientStatusID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [ParentClientID] INT,
    [Description] VARCHAR(255),
    [CurrencyID] INT NOT NULL,
    [LanguageID] INT NOT NULL,
    [Logo] VARCHAR(255) NOT NULL,
    [StartDate] VARCHAR(255) NOT NULL,
    [EndDate] VARCHAR(255) NOT NULL,
    CONSTRAINT [Client_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientUrlType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientUrlType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientUrlType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ClientUrlType] VARCHAR(40) NOT NULL,
    CONSTRAINT [ClientUrlType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientUrl] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientUrl_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientUrl_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ClientID] INT NOT NULL,
    [Url] VARCHAR(2048),
    [ClientUrlTypeID] INT NOT NULL,
    CONSTRAINT [ClientUrl_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientTheme] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ClientID] INT NOT NULL,
    [ThemeID] INT NOT NULL,
    CONSTRAINT [ClientTheme_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ClientTheme_ClientID_ThemeID_key] UNIQUE NONCLUSTERED ([ClientID],[ThemeID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientApp] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [AppID] INT NOT NULL,
    [ClientID] INT NOT NULL,
    CONSTRAINT [ClientApp_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ClientApp_AppID_ClientID_key] UNIQUE NONCLUSTERED ([AppID],[ClientID])
);

-- CreateTable
CREATE TABLE [dbo].[Service] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Service_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Service_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    CONSTRAINT [Service_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceFeature] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceFeature_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedByID] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceFeature_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedByID] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ServiceID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    CONSTRAINT [ServiceFeature_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientService] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ClientID] INT NOT NULL,
    [ServiceID] INT NOT NULL,
    CONSTRAINT [ClientService_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ClientService_ClientID_ServiceID_key] UNIQUE NONCLUSTERED ([ClientID],[ServiceID])
);

-- CreateTable
CREATE TABLE [dbo].[Country] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [Code] VARCHAR(6) NOT NULL,
    CONSTRAINT [Country_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Country_Code_key] UNIQUE NONCLUSTERED ([Code])
);

-- CreateTable
CREATE TABLE [dbo].[AddressType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Type] VARCHAR(40) NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [AddressType_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [AddressType_Type_key] UNIQUE NONCLUSTERED ([Type])
);

-- CreateTable
CREATE TABLE [dbo].[ClientAddress] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientAddress_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientAddress_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ClientID] INT NOT NULL,
    [Street1] VARCHAR(255) NOT NULL,
    [Street2] VARCHAR(255),
    [City] VARCHAR(40) NOT NULL,
    [State] VARCHAR(30) NOT NULL,
    [CountryID] INT NOT NULL,
    [ZipCode] VARCHAR(8) NOT NULL,
    [AddressTypeID] INT NOT NULL,
    CONSTRAINT [ClientAddress_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ContactInfo] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContactInfo_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedByID] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ContactInfo_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedByID] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ClientID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [EmailAddress] VARCHAR(255) NOT NULL,
    [PhoneNumber] NVARCHAR(40) NOT NULL,
    [Correspondance] BIT NOT NULL,
    CONSTRAINT [ContactInfo_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ContactInfoAddress] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContactInfoAddress_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedByID] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ContactInfoAddress_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedByID] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ContactInfoID] INT NOT NULL,
    [Street1] VARCHAR(255) NOT NULL,
    [Street2] VARCHAR(255) NOT NULL,
    [City] VARCHAR(40) NOT NULL,
    [State] VARCHAR(30) NOT NULL,
    [CountryID] INT NOT NULL,
    [ZipCode] VARCHAR(8) NOT NULL,
    [AddressTypeID] INT NOT NULL,
    CONSTRAINT [ContactInfoAddress_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ProfileType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [ProfileType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Profile] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Profile_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Profile_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [FirstName] VARCHAR(255) NOT NULL,
    [LastName] VARCHAR(255) NOT NULL,
    [MiddleName] VARCHAR(255),
    [PreferredName] VARCHAR(255),
    [Title] VARCHAR(255),
    [SapIntegration] BIT NOT NULL CONSTRAINT [Profile_SapIntegration_df] DEFAULT 0,
    [IsExternal] BIT NOT NULL CONSTRAINT [Profile_IsExternal_df] DEFAULT 0,
    [InternalMasterID] INT,
    [ExternalMasterID] NVARCHAR(18),
    [SapVendorID] VARCHAR(30),
    [ClientID] INT,
    [ManagerID] INT,
    [DelegateId] INT,
    [IdentityId] VARCHAR(255),
    [StartDate] DATETIME2,
    [EndDate] DATETIME2 NOT NULL CONSTRAINT [Profile_EndDate_df] DEFAULT '2050-12-31 23:59:59 +00:00',
    CONSTRAINT [Profile_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Profile_IdentityId_key] UNIQUE NONCLUSTERED ([IdentityId])
);

-- CreateTable
CREATE TABLE [dbo].[ProfileRole] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [RoleId] INT NOT NULL,
    CONSTRAINT [ProfileRole_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ProfileRole_ProfileID_RoleId_key] UNIQUE NONCLUSTERED ([ProfileID],[RoleId])
);

-- CreateTable
CREATE TABLE [dbo].[ProfileProfileType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [ProfileTypeID] INT NOT NULL,
    CONSTRAINT [ProfileProfileType_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ProfileProfileType_ProfileID_ProfileTypeID_key] UNIQUE NONCLUSTERED ([ProfileID],[ProfileTypeID])
);

-- CreateTable
CREATE TABLE [dbo].[PhoneType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [PhoneType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Phone] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Phone_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Phone_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ProfileID] INT NOT NULL,
    [CountryCode] NVARCHAR(6) NOT NULL,
    [PhoneNumber] VARCHAR(40) NOT NULL,
    [PhoneTypeID] INT NOT NULL,
    [Correspondance] BIT NOT NULL,
    CONSTRAINT [Phone_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Address_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Address_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Street1] VARCHAR(255) NOT NULL,
    [Street2] VARCHAR(255) NOT NULL,
    [City] VARCHAR(40) NOT NULL,
    [State] VARCHAR(30) NOT NULL,
    [CountryID] INT NOT NULL,
    [ZipCode] VARCHAR(8) NOT NULL,
    [AddressTypeID] INT NOT NULL,
    CONSTRAINT [Address_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ProfileAddress] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [AddressID] INT NOT NULL,
    [IsPrimary] BIT NOT NULL,
    CONSTRAINT [ProfileAddress_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ProfileAddress_ProfileID_AddressID_key] UNIQUE NONCLUSTERED ([ProfileID],[AddressID])
);

-- CreateTable
CREATE TABLE [dbo].[IdentifierType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [IdentifierType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientIdentifier] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientIdentifier_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientIdentifier_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ProfileID] INT NOT NULL,
    [Identifier] VARCHAR(255) NOT NULL,
    [IdentifierTypeID] INT NOT NULL,
    CONSTRAINT [ClientIdentifier_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[EmailAddressType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [EmailAddressType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Email] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Email_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Email_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [ProfileID] INT NOT NULL,
    [EmailAddress] VARCHAR(255) NOT NULL,
    [EmailAddressTypeID] INT NOT NULL,
    [Correspondance] BIT NOT NULL,
    CONSTRAINT [Email_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Permission] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Permission_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Permission_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [StartDate] DATETIME2,
    [EndDate] DATETIME2 NOT NULL CONSTRAINT [Permission_EndDate_df] DEFAULT '2050-12-31 23:59:59 +00:00',
    [Name] VARCHAR(40) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    CONSTRAINT [Permission_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[FunctionalArea] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [FunctionalArea_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [FunctionalArea_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [StartDate] DATETIME2,
    [EndDate] DATETIME2,
    [Name] VARCHAR(255) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [IsExternal] BIT NOT NULL CONSTRAINT [FunctionalArea_IsExternal_df] DEFAULT 0,
    CONSTRAINT [FunctionalArea_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientFunctionalArea] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ClientID] INT NOT NULL,
    [FunctionalAreaID] INT NOT NULL,
    CONSTRAINT [ClientFunctionalArea_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[PermissionGroup] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [PermissionGroup_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [PermissionGroup_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [StartDate] DATETIME2 NOT NULL,
    [EndDate] DATETIME2 NOT NULL,
    CONSTRAINT [PermissionGroup_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[PermissionGroupPermission] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [PermissionID] INT NOT NULL,
    [PermissionGroupID] INT NOT NULL,
    CONSTRAINT [PermissionGroupPermission_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Role_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [StartDate] DATETIME2,
    [EndDate] DATETIME2 NOT NULL,
    [FunctionalAreaID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [IsExternal] BIT NOT NULL CONSTRAINT [Role_IsExternal_df] DEFAULT 0,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[_PermissionGroupPermission] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_PermissionGroupPermission_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_permissionGroupTorole] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_permissionGroupTorole_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Profile_FirstName_LastName_MiddleName_idx] ON [dbo].[Profile]([FirstName], [LastName], [MiddleName]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Phone_PhoneNumber_idx] ON [dbo].[Phone]([PhoneNumber]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Email_EmailAddress_idx] ON [dbo].[Email]([EmailAddress]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [startDate_endDate] ON [dbo].[FunctionalArea]([StartDate], [EndDate]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Role_Name_idx] ON [dbo].[Role]([Name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_PermissionGroupPermission_B_index] ON [dbo].[_PermissionGroupPermission]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_permissionGroupTorole_B_index] ON [dbo].[_permissionGroupTorole]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[AppTheme] ADD CONSTRAINT [AppTheme_AppID_fkey] FOREIGN KEY ([AppID]) REFERENCES [dbo].[App]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppTheme] ADD CONSTRAINT [AppTheme_ThemeID_fkey] FOREIGN KEY ([ThemeID]) REFERENCES [dbo].[Theme]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Client] ADD CONSTRAINT [Client_ClientStatusID_fkey] FOREIGN KEY ([ClientStatusID]) REFERENCES [dbo].[ClientStatus]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Client] ADD CONSTRAINT [Client_CurrencyID_fkey] FOREIGN KEY ([CurrencyID]) REFERENCES [dbo].[Currency]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Client] ADD CONSTRAINT [Client_ParentClientID_fkey] FOREIGN KEY ([ParentClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClientUrl] ADD CONSTRAINT [ClientUrl_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientUrl] ADD CONSTRAINT [ClientUrl_ClientUrlTypeID_fkey] FOREIGN KEY ([ClientUrlTypeID]) REFERENCES [dbo].[ClientUrlType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientTheme] ADD CONSTRAINT [ClientTheme_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientTheme] ADD CONSTRAINT [ClientTheme_ThemeID_fkey] FOREIGN KEY ([ThemeID]) REFERENCES [dbo].[Theme]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientApp] ADD CONSTRAINT [ClientApp_AppID_fkey] FOREIGN KEY ([AppID]) REFERENCES [dbo].[App]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientApp] ADD CONSTRAINT [ClientApp_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceFeature] ADD CONSTRAINT [ServiceFeature_ServiceID_fkey] FOREIGN KEY ([ServiceID]) REFERENCES [dbo].[Service]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientService] ADD CONSTRAINT [ClientService_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientService] ADD CONSTRAINT [ClientService_ServiceID_fkey] FOREIGN KEY ([ServiceID]) REFERENCES [dbo].[Service]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientAddress] ADD CONSTRAINT [ClientAddress_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientAddress] ADD CONSTRAINT [ClientAddress_CountryID_fkey] FOREIGN KEY ([CountryID]) REFERENCES [dbo].[Country]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientAddress] ADD CONSTRAINT [ClientAddress_AddressTypeID_fkey] FOREIGN KEY ([AddressTypeID]) REFERENCES [dbo].[AddressType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ContactInfo] ADD CONSTRAINT [ContactInfo_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ContactInfoAddress] ADD CONSTRAINT [ContactInfoAddress_ContactInfoID_fkey] FOREIGN KEY ([ContactInfoID]) REFERENCES [dbo].[ContactInfo]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ContactInfoAddress] ADD CONSTRAINT [ContactInfoAddress_CountryID_fkey] FOREIGN KEY ([CountryID]) REFERENCES [dbo].[Country]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ContactInfoAddress] ADD CONSTRAINT [ContactInfoAddress_AddressTypeID_fkey] FOREIGN KEY ([AddressTypeID]) REFERENCES [dbo].[AddressType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_ManagerID_fkey] FOREIGN KEY ([ManagerID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_DelegateId_fkey] FOREIGN KEY ([DelegateId]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileRole] ADD CONSTRAINT [ProfileRole_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileRole] ADD CONSTRAINT [ProfileRole_RoleId_fkey] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileProfileType] ADD CONSTRAINT [ProfileProfileType_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileProfileType] ADD CONSTRAINT [ProfileProfileType_ProfileTypeID_fkey] FOREIGN KEY ([ProfileTypeID]) REFERENCES [dbo].[ProfileType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Phone] ADD CONSTRAINT [Phone_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Phone] ADD CONSTRAINT [Phone_PhoneTypeID_fkey] FOREIGN KEY ([PhoneTypeID]) REFERENCES [dbo].[PhoneType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Address] ADD CONSTRAINT [Address_CountryID_fkey] FOREIGN KEY ([CountryID]) REFERENCES [dbo].[Country]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Address] ADD CONSTRAINT [Address_AddressTypeID_fkey] FOREIGN KEY ([AddressTypeID]) REFERENCES [dbo].[AddressType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddress] ADD CONSTRAINT [ProfileAddress_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileAddress] ADD CONSTRAINT [ProfileAddress_AddressID_fkey] FOREIGN KEY ([AddressID]) REFERENCES [dbo].[Address]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientIdentifier] ADD CONSTRAINT [ClientIdentifier_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientIdentifier] ADD CONSTRAINT [ClientIdentifier_IdentifierTypeID_fkey] FOREIGN KEY ([IdentifierTypeID]) REFERENCES [dbo].[IdentifierType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Email] ADD CONSTRAINT [Email_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Email] ADD CONSTRAINT [Email_EmailAddressTypeID_fkey] FOREIGN KEY ([EmailAddressTypeID]) REFERENCES [dbo].[EmailAddressType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientFunctionalArea] ADD CONSTRAINT [ClientFunctionalArea_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientFunctionalArea] ADD CONSTRAINT [ClientFunctionalArea_FunctionalAreaID_fkey] FOREIGN KEY ([FunctionalAreaID]) REFERENCES [dbo].[FunctionalArea]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PermissionGroupPermission] ADD CONSTRAINT [PermissionGroupPermission_PermissionGroupID_fkey] FOREIGN KEY ([PermissionGroupID]) REFERENCES [dbo].[PermissionGroup]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PermissionGroupPermission] ADD CONSTRAINT [PermissionGroupPermission_PermissionID_fkey] FOREIGN KEY ([PermissionID]) REFERENCES [dbo].[Permission]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Role] ADD CONSTRAINT [Role_FunctionalAreaID_fkey] FOREIGN KEY ([FunctionalAreaID]) REFERENCES [dbo].[FunctionalArea]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PermissionGroupPermission] ADD CONSTRAINT [_PermissionGroupPermission_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Permission]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PermissionGroupPermission] ADD CONSTRAINT [_PermissionGroupPermission_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[PermissionGroup]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_permissionGroupTorole] ADD CONSTRAINT [_permissionGroupTorole_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[PermissionGroup]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_permissionGroupTorole] ADD CONSTRAINT [_permissionGroupTorole_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Role]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
