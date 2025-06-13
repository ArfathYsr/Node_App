BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[InternationalPrefix] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(30) NOT NULL CONSTRAINT [InternationalPrefix_Name_df] DEFAULT '+1',
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [InternationalPrefix_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [InternationalPrefix_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [InternationalPrefix_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [InternationalPrefix_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[ProfilePhoneInfo] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL CONSTRAINT [ProfilePhoneInfo_ProfileID_df] DEFAULT 1,
    [PhoneTypeId] INT NOT NULL,
    [InternationalPrefix] INT NOT NULL,
    [PhoneNumber] INT NOT NULL,
    [PhoneNumberExtension] INT NOT NULL,
    [FaxNumber] INT NOT NULL,
    [UpdatedBy] INT NOT NULL CONSTRAINT [ProfilePhoneInfo_UpdatedBy_df] DEFAULT 0,
    [CreatedBy] INT NOT NULL CONSTRAINT [ProfilePhoneInfo_CreatedBy_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfilePhoneInfo_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfilePhoneInfo_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ProfilePhoneInfo_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProfilePhoneInfo] ADD CONSTRAINT [ProfilePhoneInfo_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfilePhoneInfo] ADD CONSTRAINT [ProfilePhoneInfo_InternationalPrefix_fkey] FOREIGN KEY ([InternationalPrefix]) REFERENCES [dbo].[InternationalPrefix]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfilePhoneInfo] ADD CONSTRAINT [ProfilePhoneInfo_PhoneTypeId_fkey] FOREIGN KEY ([PhoneTypeId]) REFERENCES [dbo].[PhoneType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
