/*
  Warnings:

  - You are about to drop the column `Address` on the `VendorAddressDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Name]` on the table `ContactType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `VendorType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `VendorStatusId` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Address1` to the `VendorAddressDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Address2` to the `VendorAddressDetails` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Vendor] ADD [VendorStatusId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[VendorAddressDetails] DROP COLUMN [Address];
ALTER TABLE [dbo].[VendorAddressDetails] ADD [Address1] VARCHAR(255) NOT NULL,
[Address2] VARCHAR(255) NOT NULL,
[IsPrimary] BIT NOT NULL CONSTRAINT [VendorAddressDetails_IsPrimary_df] DEFAULT 0;

-- CreateIndex
ALTER TABLE [dbo].[ContactType] ADD CONSTRAINT [ContactType_Name_key] UNIQUE NONCLUSTERED ([Name]);

-- CreateIndex
ALTER TABLE [dbo].[Vendor] ADD CONSTRAINT [Vendor_Name_key] UNIQUE NONCLUSTERED ([Name]);

-- CreateIndex
ALTER TABLE [dbo].[VendorType] ADD CONSTRAINT [VendorType_Name_key] UNIQUE NONCLUSTERED ([Name]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
