BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ImportProfileFileName] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [FileName] VARCHAR(255) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ImportProfileFileName_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ImportProfileFileName_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ImportProfileHistory] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [FirstName] VARCHAR(255),
    [LastName] VARCHAR(255),
    [PreferredName] VARCHAR(255),
    [Email] VARCHAR(255),
    [PhoneNumber] VARCHAR(30),
    [UserName] VARCHAR(255),
    [DelegateUser] VARCHAR(255),
    [FunctionalArea] VARCHAR(255),
    [Role] VARCHAR(255),
    [Permissions] VARCHAR(255),
    [PermissionGroups] VARCHAR(255),
    [Timezone] VARCHAR(40),
    [Locale] VARCHAR(40),
    [IsSuccess] BIT,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ImportProfileHistory_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [ImportProfileFileNameId] INT NOT NULL,
    CONSTRAINT [ImportProfileHistory_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[ImportProfileFailedDetails] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ImportProfileHistoryId] INT NOT NULL,
    [FieldName] VARCHAR(50) NOT NULL,
    [FailedReason] VARCHAR(255) NOT NULL,
    CONSTRAINT [ImportProfileFailedDetails_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ImportProfileHistory] ADD CONSTRAINT [ImportProfileHistory_ImportProfileFileNameId_fkey] FOREIGN KEY ([ImportProfileFileNameId]) REFERENCES [dbo].[ImportProfileFileName]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ImportProfileFailedDetails] ADD CONSTRAINT [ImportProfileFailedDetails_ImportProfileHistoryId_fkey] FOREIGN KEY ([ImportProfileHistoryId]) REFERENCES [dbo].[ImportProfileHistory]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
