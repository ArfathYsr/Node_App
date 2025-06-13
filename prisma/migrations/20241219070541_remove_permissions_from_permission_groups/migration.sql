/*
  Warnings:

  - You are about to drop the `_PermissionGroupPermission` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_PermissionGroupPermission] DROP CONSTRAINT [_PermissionGroupPermission_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_PermissionGroupPermission] DROP CONSTRAINT [_PermissionGroupPermission_B_fkey];

-- DropTable
DROP TABLE [dbo].[_PermissionGroupPermission];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
