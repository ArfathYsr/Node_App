/*
  Warnings:

  - You are about to drop the column `brandColorCode` on the `ProfileTheme` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ProfileTheme] DROP CONSTRAINT [ProfileTheme_brandColorCode_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileTheme] DROP CONSTRAINT [ProfileTheme_interfaceThemeID_fkey];

-- AlterTable
ALTER TABLE [dbo].[ProfileTheme] ALTER COLUMN [interfaceThemeID] INT NULL;
ALTER TABLE [dbo].[ProfileTheme] DROP COLUMN [brandColorCode];
ALTER TABLE [dbo].[ProfileTheme] ADD [brandColorCodeID] INT;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileTheme] ADD CONSTRAINT [ProfileTheme_interfaceThemeID_fkey] FOREIGN KEY ([interfaceThemeID]) REFERENCES [dbo].[Interfacetheme]([interfaceThemeID]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileTheme] ADD CONSTRAINT [ProfileTheme_brandColorCodeID_fkey] FOREIGN KEY ([brandColorCodeID]) REFERENCES [dbo].[BrandColor]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
