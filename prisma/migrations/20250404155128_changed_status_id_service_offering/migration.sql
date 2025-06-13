/*
  Warnings:

  - You are about to drop the column `Status` on the `serviceOffering` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[serviceOffering] DROP COLUMN [Status];
ALTER TABLE [dbo].[serviceOffering] ADD [StatusId] INT NOT NULL CONSTRAINT [serviceOffering_StatusId_df] DEFAULT 1;

-- AddForeignKey
ALTER TABLE [dbo].[serviceOffering] ADD CONSTRAINT [serviceOffering_StatusId_fkey] FOREIGN KEY ([StatusId]) REFERENCES [dbo].[Status]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
