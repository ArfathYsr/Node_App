/*
  Warnings:

  - You are about to alter the column `Name` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `Name` on the `QuestionCategory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `Name` on the `QuestionOption` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `Name` on the `QuestionType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to drop the column `MaxCapicity` on the `VendorRoom` table. All the data in the column will be lost.
  - You are about to alter the column `RoomName` on the `VendorRoom` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `Name` on the `VendorVenue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `Phone` on the `VendorVenue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `Email` on the `VendorVenue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - Added the required column `MaxCapacity` to the `VendorRoom` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Question] ALTER COLUMN [Name] VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[QuestionCategory] ALTER COLUMN [Name] VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[QuestionOption] ALTER COLUMN [Name] VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[QuestionType] ALTER COLUMN [Name] VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[VendorRoom] ALTER COLUMN [RoomName] VARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[VendorRoom] DROP COLUMN [MaxCapicity];
ALTER TABLE [dbo].[VendorRoom] ADD [MaxCapacity] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[VendorVenue] ALTER COLUMN [Name] VARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[VendorVenue] ALTER COLUMN [Phone] VARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[VendorVenue] ALTER COLUMN [Email] VARCHAR(50) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
