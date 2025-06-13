/*
  Warnings:

  - You are about to drop the column `AdditionalNotes` on the `ClientVendors` table. All the data in the column will be lost.
  - You are about to drop the column `EndDate` on the `ClientVendors` table. All the data in the column will be lost.
  - You are about to drop the column `RelationshipStatus` on the `ClientVendors` table. All the data in the column will be lost.
  - You are about to drop the column `StartDate` on the `ClientVendors` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ClientVendors] DROP COLUMN [AdditionalNotes],
[EndDate],
[RelationshipStatus],
[StartDate];

-- AddForeignKey
ALTER TABLE [dbo].[Vendor] ADD CONSTRAINT [Vendor_VendorStatusId_fkey] FOREIGN KEY ([VendorStatusId]) REFERENCES [dbo].[VendorStatus]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
