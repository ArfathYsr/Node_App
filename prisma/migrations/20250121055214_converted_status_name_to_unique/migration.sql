/*
  Warnings:

  - A unique constraint covering the columns `[StatusName]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Status] ADD CONSTRAINT [Status_StatusName_key] UNIQUE NONCLUSTERED ([StatusName]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
