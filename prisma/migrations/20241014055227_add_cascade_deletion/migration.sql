BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ClientFunctionalArea] DROP CONSTRAINT [ClientFunctionalArea_FunctionalAreaID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Role] DROP CONSTRAINT [Role_FunctionalAreaID_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[ClientFunctionalArea] ADD CONSTRAINT [ClientFunctionalArea_FunctionalAreaID_fkey] FOREIGN KEY ([FunctionalAreaID]) REFERENCES [dbo].[FunctionalArea]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Role] ADD CONSTRAINT [Role_FunctionalAreaID_fkey] FOREIGN KEY ([FunctionalAreaID]) REFERENCES [dbo].[FunctionalArea]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProductStatus] ADD CONSTRAINT [ProductStatus_CreatedBy_fkey] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProductStatus] ADD CONSTRAINT [ProductStatus_UpdatedBy_fkey] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
