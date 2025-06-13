/*
  Warnings:

  - You are about to drop the column `RoleId` on the `Profile` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Profile] DROP CONSTRAINT [Profile_RoleId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Profile] DROP COLUMN [RoleId];

-- CreateTable
CREATE TABLE [dbo].[ProfileRole] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [RoleID] INT NOT NULL,
    CONSTRAINT [ProfileRole_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileRole] ADD CONSTRAINT [ProfileRole_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileRole] ADD CONSTRAINT [ProfileRole_RoleID_fkey] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
