/*
  Warnings:

  - Made the column `IsActive` on table `Permission` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Permission] ALTER COLUMN [IsActive] BIT NOT NULL;
ALTER TABLE [dbo].[Permission] ADD CONSTRAINT [Permission_IsActive_df] DEFAULT 1 FOR [IsActive];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
