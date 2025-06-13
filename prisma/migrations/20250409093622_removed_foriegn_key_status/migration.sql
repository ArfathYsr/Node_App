BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[serviceOffering] DROP CONSTRAINT [serviceOffering_StatusId_fkey];

-- AlterTable
ALTER TABLE [dbo].[serviceOffering] DROP CONSTRAINT [serviceOffering_StatusId_df];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
