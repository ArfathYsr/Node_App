BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[RolePermission] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [RolePermission_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [RoleID] INT NOT NULL,
    [PermissionID] INT NOT NULL,
    CONSTRAINT [RolePermission_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[RolePermission] ADD CONSTRAINT [RolePermission_RoleID_fkey] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RolePermission] ADD CONSTRAINT [RolePermission_PermissionID_fkey] FOREIGN KEY ([PermissionID]) REFERENCES [dbo].[Permission]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
