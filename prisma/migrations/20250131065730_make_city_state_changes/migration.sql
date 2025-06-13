/*
  Warnings:

  - You are about to drop the column `City` on the `ClientAddress` table. All the data in the column will be lost.
  - You are about to drop the column `State` on the `ClientAddress` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ClientAddress] DROP COLUMN [City],
[State];
ALTER TABLE [dbo].[ClientAddress] ADD [CityID] INT NOT NULL CONSTRAINT [ClientAddress_CityID_df] DEFAULT 1,
[StateID] INT NOT NULL CONSTRAINT [ClientAddress_StateID_df] DEFAULT 1;

-- AddForeignKey
ALTER TABLE [dbo].[ClientAddress] ADD CONSTRAINT [ClientAddress_CityID_fkey] FOREIGN KEY ([CityID]) REFERENCES [dbo].[City]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientAddress] ADD CONSTRAINT [ClientAddress_StateID_fkey] FOREIGN KEY ([StateID]) REFERENCES [dbo].[State]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
