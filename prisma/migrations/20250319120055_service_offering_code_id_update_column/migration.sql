/*
  Warnings:

  - You are about to drop the column `ServiceOfferingId` on the `serviceOffering` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[serviceOffering] DROP COLUMN [ServiceOfferingId];
ALTER TABLE [dbo].[serviceOffering] ADD [ServiceOfferingCodeId] INT NOT NULL CONSTRAINT [serviceOffering_ServiceOfferingCodeId_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
