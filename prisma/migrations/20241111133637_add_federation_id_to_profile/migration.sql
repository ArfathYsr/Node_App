BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Profile] ADD [FederationId] VARCHAR(255);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
