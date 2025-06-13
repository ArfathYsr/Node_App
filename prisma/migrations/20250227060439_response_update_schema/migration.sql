/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `QuestionCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `QuestionType` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[VendorQuestionResponse] ALTER COLUMN [QuestionOptionId] INT NULL;
ALTER TABLE [dbo].[VendorQuestionResponse] ALTER COLUMN [CustomValue] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[VendorQuestionResponse] ALTER COLUMN [FileURL] NVARCHAR(1000) NULL;

-- CreateTable
CREATE TABLE [dbo].[QuestionOption] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [QuestionId] INT NOT NULL,
    [Option] VARCHAR(50) NOT NULL,
    [IsActive] BIT NOT NULL,
    [DisplayOrder] INT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionOption_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionOption_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [QuestionOption_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateIndex
ALTER TABLE [dbo].[QuestionCategory] ADD CONSTRAINT [QuestionCategory_Name_key] UNIQUE NONCLUSTERED ([Name]);

-- CreateIndex
ALTER TABLE [dbo].[QuestionType] ADD CONSTRAINT [QuestionType_Name_key] UNIQUE NONCLUSTERED ([Name]);

-- AddForeignKey
ALTER TABLE [dbo].[QuestionOption] ADD CONSTRAINT [QuestionOption_QuestionId_fkey] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorQuestionResponse] ADD CONSTRAINT [VendorQuestionResponse_QuestionOptionId_fkey] FOREIGN KEY ([QuestionOptionId]) REFERENCES [dbo].[QuestionOption]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
