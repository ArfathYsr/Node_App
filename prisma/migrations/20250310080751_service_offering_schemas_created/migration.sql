BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ServiceType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [IsActive] BIT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ServiceType_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ServiceType_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[serviceOffering] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [Status] BIT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [serviceOffering_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [serviceOffering_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [serviceOffering_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceTypeOffering] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ServicetypeId] INT NOT NULL,
    [ServiceOfferingId] INT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceTypeOffering_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceTypeOffering_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ServiceTypeOffering_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ServiceTypeOffering] ADD CONSTRAINT [ServiceTypeOffering_ServicetypeId_fkey] FOREIGN KEY ([ServicetypeId]) REFERENCES [dbo].[ServiceType]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceTypeOffering] ADD CONSTRAINT [ServiceTypeOffering_ServiceOfferingId_fkey] FOREIGN KEY ([ServiceOfferingId]) REFERENCES [dbo].[serviceOffering]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
