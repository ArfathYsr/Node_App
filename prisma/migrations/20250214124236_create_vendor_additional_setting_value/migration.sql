/*
  Warnings:

  - You are about to drop the column `Value` on the `VendorAdditionalSetting` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[VendorAdditionalSetting] DROP COLUMN [Value];

-- CreateTable
CREATE TABLE [dbo].[VendorAdditionalSettingValue] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [VendorAdditionalSettingID] INT NOT NULL,
    [Value] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorAdditionalSettingValue_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorAdditionalSettingValue_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VendorAdditionalSettingValue_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[VendorAdditionalSettingValue] ADD CONSTRAINT [VendorAdditionalSettingValue_VendorAdditionalSettingID_fkey] FOREIGN KEY ([VendorAdditionalSettingID]) REFERENCES [dbo].[VendorAdditionalSetting]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
