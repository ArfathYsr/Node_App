BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[FunctionalArea] DROP CONSTRAINT [FunctionalArea_ArchivedAt_df];

-- AlterTable
ALTER TABLE [dbo].[Role] DROP CONSTRAINT [Role_ArchivedAt_df];

-- AddForeignKey
ALTER TABLE [dbo].[TherapeuticArea] ADD CONSTRAINT [TherapeuticArea_CreatedBy_fkey] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TherapeuticArea] ADD CONSTRAINT [TherapeuticArea_UpdatedBy_fkey] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
