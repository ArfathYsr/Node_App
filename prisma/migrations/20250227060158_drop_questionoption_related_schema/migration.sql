/*
  Warnings:

  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[QuestionOption] DROP CONSTRAINT [QuestionOption_QuestionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[VendorQuestionResponse] DROP CONSTRAINT [VendorQuestionResponse_QuestionOptionId_fkey];

-- DropTable
DROP TABLE [dbo].[QuestionOption];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
