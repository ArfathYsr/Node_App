BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Profile] ADD [ProfileStatusId] INT NOT NULL CONSTRAINT [Profile_ProfileStatusId_df] DEFAULT 1;

-- CreateTable
CREATE TABLE [dbo].[ProfileStatus] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [StatusName] VARCHAR(255) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileStatus_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileStatus_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [ProfileStatus_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [ProfileStatus_StatusName_key] UNIQUE NONCLUSTERED ([StatusName])
);

--Insert Data
INSERT INTO [dbo].[ProfileStatus] (StatusName, CreatedBy, UpdatedBy)
VALUES ('Active', 1, 1);

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_ProfileStatusId_fkey] FOREIGN KEY ([ProfileStatusId]) REFERENCES [dbo].[ProfileStatus]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
