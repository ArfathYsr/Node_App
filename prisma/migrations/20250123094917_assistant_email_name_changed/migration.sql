/*
  Warnings:

  - You are about to drop the column `AssistatEmail` on the `Profile` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Profile] DROP COLUMN [AssistatEmail];
ALTER TABLE [dbo].[Profile] ADD [AssistantEmail] VARCHAR(255);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
