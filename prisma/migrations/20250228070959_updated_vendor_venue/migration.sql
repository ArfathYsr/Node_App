/*
  Warnings:

  - You are about to drop the column `Name` on the `VendorVenue` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `VendorVenue` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[VendorVenue] DROP COLUMN [Name],[Phone];
ALTER TABLE [dbo].[VendorVenue] ADD [ContactName] VARCHAR(50) NOT NULL CONSTRAINT [VendorVenue_ContactName_df] DEFAULT 'default contactName',
[PhoneNumber] VARCHAR(50) NOT NULL CONSTRAINT [VendorVenue_PhoneNumber_df] DEFAULT 'default ohone',
[VenueName] VARCHAR(50) NOT NULL CONSTRAINT [VendorVenue_VenueName_df] DEFAULT 'default venue';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
