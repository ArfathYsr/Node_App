/*
  Warnings:

  - You are about to drop the column `CityID` on the `ClientAddress` table. All the data in the column will be lost.
  - You are about to drop the column `StateID` on the `ClientAddress` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ClientAddress] DROP COLUMN [CityID],
[StateID];
ALTER TABLE [dbo].[ClientAddress] ADD [City] VARCHAR(40),
[State] VARCHAR(30);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
