BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[VendorQuestionResponse] ADD [VendorRoomId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[VendorQuestionResponse] ADD CONSTRAINT [VendorQuestionResponse_VendorRoomId_fkey] FOREIGN KEY ([VendorRoomId]) REFERENCES [dbo].[VendorRoom]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
