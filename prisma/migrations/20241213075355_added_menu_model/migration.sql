BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Menu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [MenuName] VARCHAR(255) NOT NULL,
    [ParentClientID] INT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Menu_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [Menu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PermissionMenu] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [MenuId] INT NOT NULL,
    [PermissionId] INT NOT NULL,
    [StartDate] DATETIME2,
    [EndDate] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [PermissionMenu_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [PermissionMenu_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [PermissionMenu_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Menu] ADD CONSTRAINT [Menu_CreatedBy_fkey] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Menu] ADD CONSTRAINT [Menu_UpdatedBy_fkey] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PermissionMenu] ADD CONSTRAINT [PermissionMenu_MenuId_fkey] FOREIGN KEY ([MenuId]) REFERENCES [dbo].[Menu]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PermissionMenu] ADD CONSTRAINT [PermissionMenu_PermissionId_fkey] FOREIGN KEY ([PermissionId]) REFERENCES [dbo].[Permission]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PermissionMenu] ADD CONSTRAINT [PermissionMenu_CreatedBy_fkey] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PermissionMenu] ADD CONSTRAINT [PermissionMenu_UpdatedBy_fkey] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
