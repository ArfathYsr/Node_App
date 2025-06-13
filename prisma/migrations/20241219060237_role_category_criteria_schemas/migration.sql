BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[RoleCategory] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCategory_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCategory_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [RoleCategoryName] VARCHAR(255) NOT NULL,
    CONSTRAINT [RoleCategory_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [RoleCategory_RoleCategoryName_key] UNIQUE NONCLUSTERED ([RoleCategoryName])
);

-- CreateTable
CREATE TABLE [dbo].[RoleCriteria] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [RoleCriteriaName] VARCHAR(255) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCriteria_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCriteria_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [RoleCriteria_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [RoleCriteria_RoleCriteriaName_key] UNIQUE NONCLUSTERED ([RoleCriteriaName])
);

-- CreateTable
CREATE TABLE [dbo].[RoleCategoryAlignment] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [roleId] INT NOT NULL,
    [roleCategoryId] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCategoryAlignment_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCategoryAlignment_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    CONSTRAINT [RoleCategoryAlignment_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[RoleCriteriaAlignment] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [roleId] INT NOT NULL,
    [roleCriteriaId] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCriteriaAlignment_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [RoleCriteriaAlignment_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [RoleCriteriaResponse] VARCHAR(255) NOT NULL,
    CONSTRAINT [RoleCriteriaAlignment_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[RoleCategoryAlignment] ADD CONSTRAINT [RoleCategoryAlignment_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RoleCategoryAlignment] ADD CONSTRAINT [RoleCategoryAlignment_roleCategoryId_fkey] FOREIGN KEY ([roleCategoryId]) REFERENCES [dbo].[RoleCategory]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RoleCriteriaAlignment] ADD CONSTRAINT [RoleCriteriaAlignment_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RoleCriteriaAlignment] ADD CONSTRAINT [RoleCriteriaAlignment_roleCriteriaId_fkey] FOREIGN KEY ([roleCriteriaId]) REFERENCES [dbo].[RoleCriteria]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
