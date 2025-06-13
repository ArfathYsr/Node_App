BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Lookup_AVCategory] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [IsActive] BIT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Lookup_AVCategory_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Lookup_AVCategory_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Lookup_AVCategory_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Lookup_AVCategory_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[Lookup_AV] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [IsActive] BIT NOT NULL,
    [Description] VARCHAR(255),
    [Price] INT NOT NULL,
    [AvCategoryId] INT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Lookup_AV_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Lookup_AV_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Lookup_AV_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Lookup_AV_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[Engagement_EngagementAv] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [IsActive] BIT NOT NULL,
    [AvId] INT NOT NULL,
    [EngagementId] INT NOT NULL,
    [VendorId] INT NOT NULL,
    [ProfileId] INT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Engagement_EngagementAv_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Engagement_EngagementAv_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Engagement_EngagementAv_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[EngagementType_EngagementType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [IsActive] BIT NOT NULL,
    [TherapeuticAreaId] INT NOT NULL,
    [EngagementTypeId] INT NOT NULL,
    [PrimaryStartDate] DATETIME2 NOT NULL CONSTRAINT [EngagementType_EngagementType_PrimaryStartDate_df] DEFAULT CURRENT_TIMESTAMP,
    [AlternateStartDate1] DATETIME2,
    [AlternateStartDate2] DATETIME2,
    [Field] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [EngagementType_EngagementType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [EngagementType_EngagementType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [EngagementType_EngagementType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[lookup_Duration] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [Status] BIT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [lookup_Duration_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [lookup_Duration_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [lookup_Duration_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Lookup_AV] ADD CONSTRAINT [Lookup_AV_AvCategoryId_fkey] FOREIGN KEY ([AvCategoryId]) REFERENCES [dbo].[Lookup_AVCategory]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Engagement_EngagementAv] ADD CONSTRAINT [Engagement_EngagementAv_AvId_fkey] FOREIGN KEY ([AvId]) REFERENCES [dbo].[Lookup_AV]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Engagement_EngagementAv] ADD CONSTRAINT [Engagement_EngagementAv_VendorId_fkey] FOREIGN KEY ([VendorId]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Engagement_EngagementAv] ADD CONSTRAINT [Engagement_EngagementAv_ProfileId_fkey] FOREIGN KEY ([ProfileId]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EngagementType_EngagementType] ADD CONSTRAINT [EngagementType_EngagementType_TherapeuticAreaId_fkey] FOREIGN KEY ([TherapeuticAreaId]) REFERENCES [dbo].[TherapeuticArea]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
