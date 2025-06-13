BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[PermissionGroupPermission] DROP CONSTRAINT [PermissionGroupPermission_PermissionGroupID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[PermissionGroupPermission] DROP CONSTRAINT [PermissionGroupPermission_PermissionID_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[PermissionGroupPermission] ADD CONSTRAINT [PermissionGroupPermission_PermissionID_fkey] FOREIGN KEY ([PermissionID]) REFERENCES [dbo].[Permission]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
