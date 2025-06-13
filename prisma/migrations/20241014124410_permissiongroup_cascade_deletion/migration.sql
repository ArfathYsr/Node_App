BEGIN TRY

BEGIN TRAN;

-- AddForeignKey
ALTER TABLE [dbo].[PermissionGroupPermission] ADD CONSTRAINT [PermissionGroupPermission_PermissionGroupID_fkey] FOREIGN KEY ([PermissionGroupID]) REFERENCES [dbo].[PermissionGroup]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
