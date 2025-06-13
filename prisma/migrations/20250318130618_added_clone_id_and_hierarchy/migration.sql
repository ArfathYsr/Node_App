BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ClientHierarchy] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [Description] VARCHAR(255),
    [NumberOfLevels] INT NOT NULL,
    [StatusID] INT NOT NULL,
    [EffectiveDate] DATETIME2 NOT NULL,
    [EndDate] DATETIME2,
    [FieldReleaseDate] DATETIME2,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientHierarchy_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ClientHierarchy_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [ClientID] INT,
    [CloneID] INT,
    CONSTRAINT [ClientHierarchy_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[HierarchyLevel] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [AllowMultipleLevelValue] BIT NOT NULL,
    [IsActive] BIT NOT NULL,
    [LevelOrder] INT NOT NULL,
    [ClientHierarchyID] INT NOT NULL,
    [ParentHierarchyLevelID] INT,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [HierarchyLevel_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [HierarchyLevel_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HierarchyLevel_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ClientHierarchy] ADD CONSTRAINT [ClientHierarchy_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientHierarchy] ADD CONSTRAINT [ClientHierarchy_StatusID_fkey] FOREIGN KEY ([StatusID]) REFERENCES [dbo].[Status]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HierarchyLevel] ADD CONSTRAINT [HierarchyLevel_ClientHierarchyID_fkey] FOREIGN KEY ([ClientHierarchyID]) REFERENCES [dbo].[ClientHierarchy]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HierarchyLevel] ADD CONSTRAINT [HierarchyLevel_ParentHierarchyLevelID_fkey] FOREIGN KEY ([ParentHierarchyLevelID]) REFERENCES [dbo].[HierarchyLevel]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
