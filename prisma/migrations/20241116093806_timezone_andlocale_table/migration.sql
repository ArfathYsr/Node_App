/*
  Warnings:

  - You are about to drop the `Local` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Profile] DROP CONSTRAINT [Profile_localeId_fkey];

-- DropTable
DROP TABLE [dbo].[Local];

-- CreateTable
CREATE TABLE [dbo].[locale] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [locale_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    CONSTRAINT [locale_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_localeId_fkey] FOREIGN KEY ([localeId]) REFERENCES [dbo].[locale]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
