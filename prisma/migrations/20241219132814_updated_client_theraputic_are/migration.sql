/*
  Warnings:

  - You are about to drop the column `TherapeuticAreaID` on the `ClientTherapeuticArea` table. All the data in the column will be lost.
  - Added the required column `TherapeuticAreaId` to the `ClientTherapeuticArea` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ClientTherapeuticArea] DROP CONSTRAINT [ClientTherapeuticArea_TherapeuticAreaID_fkey];

-- AlterTable
ALTER TABLE [dbo].[ClientTherapeuticArea] DROP COLUMN [TherapeuticAreaID];
ALTER TABLE [dbo].[ClientTherapeuticArea] ADD [TherapeuticAreaId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[ClientTherapeuticArea] ADD CONSTRAINT [ClientTherapeuticArea_TherapeuticAreaId_fkey] FOREIGN KEY ([TherapeuticAreaId]) REFERENCES [dbo].[TherapeuticArea]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
