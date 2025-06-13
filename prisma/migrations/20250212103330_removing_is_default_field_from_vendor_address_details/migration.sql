/*
  Warnings:

  - You are about to drop the column `IsDefault` on the `VendorAddressDetails` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[VendorAddressDetails] DROP COLUMN [IsDefault];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
