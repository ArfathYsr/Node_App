BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ClientAddress] DROP CONSTRAINT [ClientAddress_CityID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ClientAddress] DROP CONSTRAINT [ClientAddress_StateID_fkey];

-- AlterTable
ALTER TABLE [dbo].[ClientAddress] DROP CONSTRAINT [ClientAddress_CityID_df],
[ClientAddress_StateID_df];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
