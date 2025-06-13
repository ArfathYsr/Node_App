BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ProfileFunctionalArea] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [FuntionalAreaID] INT NOT NULL,
    CONSTRAINT [ProfileFunctionalArea_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ProfilePermission] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [PermissionID] INT NOT NULL,
    CONSTRAINT [ProfilePermission_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ProfilePermissionGroup] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [PermissionGroupID] INT NOT NULL,
    CONSTRAINT [ProfilePermissionGroup_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileFunctionalArea] ADD CONSTRAINT [ProfileFunctionalArea_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileFunctionalArea] ADD CONSTRAINT [ProfileFunctionalArea_FuntionalAreaID_fkey] FOREIGN KEY ([FuntionalAreaID]) REFERENCES [dbo].[FunctionalArea]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfilePermission] ADD CONSTRAINT [ProfilePermission_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfilePermission] ADD CONSTRAINT [ProfilePermission_PermissionID_fkey] FOREIGN KEY ([PermissionID]) REFERENCES [dbo].[Permission]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfilePermissionGroup] ADD CONSTRAINT [ProfilePermissionGroup_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfilePermissionGroup] ADD CONSTRAINT [ProfilePermissionGroup_PermissionGroupID_fkey] FOREIGN KEY ([PermissionGroupID]) REFERENCES [dbo].[PermissionGroup]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
