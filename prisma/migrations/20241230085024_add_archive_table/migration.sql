BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ArchiveFilter] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ArchiveFilterName] VARCHAR(30) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ArchiveFilter_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ArchiveFilter_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ArchiveFilter_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ArchiveFilter_ArchiveFilterName_key] UNIQUE NONCLUSTERED ([ArchiveFilterName])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
