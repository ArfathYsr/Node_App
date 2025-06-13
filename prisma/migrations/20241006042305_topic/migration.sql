BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[PermissionGroup] ALTER COLUMN [StartDate] DATETIME2 NULL;
ALTER TABLE [dbo].[PermissionGroup] ALTER COLUMN [EndDate] DATETIME2 NULL;

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Product_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [StartDate] DATETIME2 NOT NULL,
    [EndDate] DATETIME2 NOT NULL,
    [FieldReleaseDate] DATETIME2 NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    [DisplayName] VARCHAR(40) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [Unbranded] BIT NOT NULL CONSTRAINT [Product_Unbranded_df] DEFAULT 0,
    [ProductStatusID] INT NOT NULL,
    [ISILink] VARCHAR(2048) NOT NULL,
    [PILink] VARCHAR(2048) NOT NULL,
    [Logo] VARCHAR(2048) NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ProductStatus] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ProductStatus_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [Name] VARCHAR(30) NOT NULL,
    CONSTRAINT [ProductStatus_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Topic] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Topic_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [StartDate] DATETIME2 NOT NULL,
    [EndDate] DATETIME2 NOT NULL,
    [FieldReleaseDate] DATETIME2 NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [PresentationTitle] VARCHAR(255) NOT NULL,
    [InvitationTitle] VARCHAR(255) NOT NULL,
    [TopicTypeID] INT NOT NULL,
    [EngagementTypeID] INT NOT NULL,
    [LocationTypeID] INT NOT NULL,
    [Unbranded] BIT NOT NULL CONSTRAINT [Topic_Unbranded_df] DEFAULT 0,
    [TopicStatusID] INT NOT NULL,
    [Logo] VARCHAR(2048) NOT NULL,
    CONSTRAINT [Topic_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ProductTopic] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProductID] INT NOT NULL,
    [TopicID] INT NOT NULL,
    CONSTRAINT [ProductTopic_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[TopicStatus] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [TopicStatus_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [Name] VARCHAR(30) NOT NULL,
    CONSTRAINT [TopicStatus_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[TopicType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [TopicType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    CONSTRAINT [TopicType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[TherapeuticArea] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [TherapeuticArea_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [StartDate] DATETIME2 NOT NULL,
    [EndDate] DATETIME2 NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    CONSTRAINT [TherapeuticArea_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[TherapeuticAreaProduct] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [TherapeuticAreaID] INT NOT NULL,
    [ProductID] INT NOT NULL,
    CONSTRAINT [TherapeuticAreaProduct_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ClientTherapeuticArea] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [TherapeuticAreaID] INT NOT NULL,
    [ClientID] INT NOT NULL,
    CONSTRAINT [ClientTherapeuticArea_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[EngagementType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [EngagementType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [EngagementType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[LocationType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [LocationType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    CONSTRAINT [LocationType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Content] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Content_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [StartDate] DATETIME2 NOT NULL,
    [EndDate] DATETIME2 NOT NULL,
    [FieldReleaseDate] DATETIME2 NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    [DisplayName] VARCHAR(40) NOT NULL,
    [Description] VARCHAR(255) NOT NULL,
    [ContentTypeID] INT NOT NULL,
    [ContentFile] VARCHAR(2048) NOT NULL,
    [ContentFileFormatID] INT NOT NULL,
    [ContentDurationID] INT NOT NULL,
    [Unbranded] BIT NOT NULL CONSTRAINT [Content_Unbranded_df] DEFAULT 0,
    [ContentStatusID] INT NOT NULL,
    [Logo] VARCHAR(2048) NOT NULL,
    CONSTRAINT [Content_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[TopicContent] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [TopicID] INT NOT NULL,
    [ContentID] INT NOT NULL,
    CONSTRAINT [TopicContent_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ContentType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContentType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    CONSTRAINT [ContentType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ContentStatus] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContentStatus_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [Name] VARCHAR(30) NOT NULL,
    CONSTRAINT [ContentStatus_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ContentFileFormat] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContentFileFormat_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    CONSTRAINT [ContentFileFormat_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ContentDuration] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContentDuration_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    [Duration] INT NOT NULL,
    CONSTRAINT [ContentDuration_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_ProductStatusID_fkey] FOREIGN KEY ([ProductStatusID]) REFERENCES [dbo].[ProductStatus]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_CreatedBy_fkey] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_UpdatedBy_fkey] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Topic] ADD CONSTRAINT [Topic_TopicStatusID_fkey] FOREIGN KEY ([TopicStatusID]) REFERENCES [dbo].[TopicStatus]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Topic] ADD CONSTRAINT [Topic_TopicTypeID_fkey] FOREIGN KEY ([TopicTypeID]) REFERENCES [dbo].[TopicType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Topic] ADD CONSTRAINT [Topic_EngagementTypeID_fkey] FOREIGN KEY ([EngagementTypeID]) REFERENCES [dbo].[EngagementType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Topic] ADD CONSTRAINT [Topic_LocationTypeID_fkey] FOREIGN KEY ([LocationTypeID]) REFERENCES [dbo].[LocationType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Topic] ADD CONSTRAINT [Topic_CreatedBy_fkey] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Topic] ADD CONSTRAINT [Topic_UpdatedBy_fkey] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProductTopic] ADD CONSTRAINT [ProductTopic_ProductID_fkey] FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Product]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProductTopic] ADD CONSTRAINT [ProductTopic_TopicID_fkey] FOREIGN KEY ([TopicID]) REFERENCES [dbo].[Topic]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TherapeuticAreaProduct] ADD CONSTRAINT [TherapeuticAreaProduct_ProductID_fkey] FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Product]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TherapeuticAreaProduct] ADD CONSTRAINT [TherapeuticAreaProduct_TherapeuticAreaID_fkey] FOREIGN KEY ([TherapeuticAreaID]) REFERENCES [dbo].[TherapeuticArea]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientTherapeuticArea] ADD CONSTRAINT [ClientTherapeuticArea_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientTherapeuticArea] ADD CONSTRAINT [ClientTherapeuticArea_TherapeuticAreaID_fkey] FOREIGN KEY ([TherapeuticAreaID]) REFERENCES [dbo].[TherapeuticArea]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Content] ADD CONSTRAINT [Content_ContentTypeID_fkey] FOREIGN KEY ([ContentTypeID]) REFERENCES [dbo].[ContentType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Content] ADD CONSTRAINT [Content_ContentStatusID_fkey] FOREIGN KEY ([ContentStatusID]) REFERENCES [dbo].[ContentStatus]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Content] ADD CONSTRAINT [Content_ContentFileFormatID_fkey] FOREIGN KEY ([ContentFileFormatID]) REFERENCES [dbo].[ContentFileFormat]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Content] ADD CONSTRAINT [Content_ContentDurationID_fkey] FOREIGN KEY ([ContentDurationID]) REFERENCES [dbo].[ContentDuration]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TopicContent] ADD CONSTRAINT [TopicContent_TopicID_fkey] FOREIGN KEY ([TopicID]) REFERENCES [dbo].[Topic]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TopicContent] ADD CONSTRAINT [TopicContent_ContentID_fkey] FOREIGN KEY ([ContentID]) REFERENCES [dbo].[Content]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
