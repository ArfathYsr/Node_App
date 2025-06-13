/*
  Warnings:
  
  - You are about to drop the column `TypeField` on the `QuestionValidation` table. All the data in the column will be lost.
  - You are about to drop the column `TypeValue` on the `QuestionValidation` table. All the data in the column will be lost.
  - Added the required column `TypeValidationId` to the `QuestionValidation` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[QuestionValidation] DROP COLUMN [TypeField],
[TypeValue];
ALTER TABLE [dbo].[QuestionValidation] ADD [TypeValidationId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[TypeValidation] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [TypeField] VARCHAR(50) NOT NULL,
    [TypeValue] VARCHAR(50) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [TypeValidation_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [TypeValidation_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [TypeValidation_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[QuestionValidation] ADD CONSTRAINT [QuestionValidation_TypeValidationId_fkey] FOREIGN KEY ([TypeValidationId]) REFERENCES [dbo].[TypeValidation]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
