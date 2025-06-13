/*
  Warnings:

  - You are about to drop the `BrandColor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterfaceTheme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileTheme` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ProfileTheme] DROP CONSTRAINT [FK_ProfileTheme_BrandColor];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileTheme] DROP CONSTRAINT [FK_ProfileTheme_Profile];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileTheme] DROP CONSTRAINT [FK_ProfileTheme_Theme];

-- DropTable
DROP TABLE [dbo].[BrandColor];

-- DropTable
DROP TABLE [dbo].[InterfaceTheme];

-- DropTable
DROP TABLE [dbo].[ProfileTheme];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
