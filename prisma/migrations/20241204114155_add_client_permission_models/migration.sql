BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ClientPermission] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ClientID] INT NOT NULL,
    [PermissionID] INT NOT NULL,
    CONSTRAINT [ClientPermission_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ClientPermission] ADD CONSTRAINT [ClientPermission_ClientID_fkey] FOREIGN KEY ([ClientID]) REFERENCES [dbo].[Client]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClientPermission] ADD CONSTRAINT [ClientPermission_PermissionID_fkey] FOREIGN KEY ([PermissionID]) REFERENCES [dbo].[Permission]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
