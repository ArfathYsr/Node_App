BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Profile] ADD [localeId] INT,
[timezoneId] INT;

-- CreateTable
CREATE TABLE [dbo].[TimeZone] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [TimeZone_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    CONSTRAINT [TimeZone_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Local] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Local_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [IsActive] BIT NOT NULL,
    [Name] VARCHAR(40) NOT NULL,
    CONSTRAINT [Local_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_timezoneId_fkey] FOREIGN KEY ([timezoneId]) REFERENCES [dbo].[TimeZone]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_localeId_fkey] FOREIGN KEY ([localeId]) REFERENCES [dbo].[Local]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
