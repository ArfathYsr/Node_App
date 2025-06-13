/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Menu] ADD CONSTRAINT [Menu_Name_key] UNIQUE NONCLUSTERED ([Name]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
