/*
  Warnings:
  
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorAdditionalSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorAdditionalSettingValue` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Question] DROP CONSTRAINT [Question_QuestionCategoryId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Question] DROP CONSTRAINT [Question_QuestionTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[QuestionOption] DROP CONSTRAINT [QuestionOption_QuestionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] DROP CONSTRAINT [VendorAdditionalSetting_QuestionCategoryId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] DROP CONSTRAINT [VendorAdditionalSetting_QuestionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] DROP CONSTRAINT [VendorAdditionalSetting_QuestionTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] DROP CONSTRAINT [VendorAdditionalSetting_VendorID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[VendorAdditionalSettingValue] DROP CONSTRAINT [VendorAdditionalSettingValue_VendorAdditionalSettingID_fkey];

-- DropTable
DROP TABLE [dbo].[Question];

-- DropTable
DROP TABLE [dbo].[QuestionCategory];

-- DropTable
DROP TABLE [dbo].[QuestionOption];

-- DropTable
DROP TABLE [dbo].[QuestionType];

-- DropTable
DROP TABLE [dbo].[VendorAdditionalSetting];

-- DropTable
DROP TABLE [dbo].[VendorAdditionalSettingValue];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
