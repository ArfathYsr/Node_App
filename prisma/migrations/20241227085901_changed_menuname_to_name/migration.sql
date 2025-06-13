/*
  Warnings:

  - You are about to drop the column `MenuName` on the `Menu` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Menu] DROP COLUMN [MenuName];
ALTER TABLE [dbo].[Menu] ADD [Name] VARCHAR(255) NOT NULL CONSTRAINT [Menu_Name_df] DEFAULT 'DefaultName';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
