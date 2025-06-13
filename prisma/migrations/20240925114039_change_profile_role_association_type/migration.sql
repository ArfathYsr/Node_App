/*
  Warnings:

  - You are about to drop the `ProfileRole` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ProfileRole] DROP CONSTRAINT [ProfileRole_ProfileID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileRole] DROP CONSTRAINT [ProfileRole_RoleId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Profile] ADD [RoleId] INT;

-- DropTable
DROP TABLE [dbo].[ProfileRole];

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_RoleId_fkey] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
