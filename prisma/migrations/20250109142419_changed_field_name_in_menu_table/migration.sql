/*
  Warnings:

  - You are about to drop the column `ParentClientID` on the `Menu` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Menu] DROP CONSTRAINT [Menu_ParentClientID_fkey];

-- AlterTable
ALTER TABLE [dbo].[Menu] DROP COLUMN [ParentClientID];
ALTER TABLE [dbo].[Menu] ADD [ParentMenuID] INT;

-- AddForeignKey
ALTER TABLE [dbo].[Menu] ADD CONSTRAINT [Menu_ParentMenuID_fkey] FOREIGN KEY ([ParentMenuID]) REFERENCES [dbo].[Menu]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
