/*
  Warnings:

  - You are about to drop the `_permissionGroupTorole` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_permissionGroupTorole] DROP CONSTRAINT [_permissionGroupTorole_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_permissionGroupTorole] DROP CONSTRAINT [_permissionGroupTorole_B_fkey];

-- DropTable
DROP TABLE [dbo].[_permissionGroupTorole];

-- CreateTable
CREATE TABLE [dbo].[RolePermissionGroup] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [RoleID] INT NOT NULL,
    [PermissionGroupID] INT NOT NULL,
    CONSTRAINT [RolePermissionGroup_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[RolePermissionGroup] ADD CONSTRAINT [RolePermissionGroup_PermissionGroupID_fkey] FOREIGN KEY ([PermissionGroupID]) REFERENCES [dbo].[PermissionGroup]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RolePermissionGroup] ADD CONSTRAINT [RolePermissionGroup_RoleID_fkey] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
