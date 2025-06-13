/*
  Warnings:

  - You are about to alter the column `StartDate` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `DateTime2`.
  - You are about to alter the column `EndDate` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `DateTime2`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Client] ALTER COLUMN [StartDate] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[Client] ALTER COLUMN [EndDate] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
