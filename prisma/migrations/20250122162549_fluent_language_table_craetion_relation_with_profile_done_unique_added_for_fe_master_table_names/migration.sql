/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `locale` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `PhoneType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `TimeZone` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Profile] ADD [AssistantName] VARCHAR(255),
[AssistatEmail] VARCHAR(255),
[CentrisID] VARCHAR(30),
[IsSpeaker] BIT NOT NULL CONSTRAINT [Profile_IsSpeaker_df] DEFAULT 0,
[MasterProfileId] VARCHAR(30),
[OCEPersonalID] VARCHAR(30),
[Photo] VARCHAR(255),
[Salutation] VARCHAR(30),
[Suffix] VARCHAR(30),
[VeevaID] VARCHAR(30),
[oneKeyID] VARCHAR(30);

-- CreateTable
CREATE TABLE [dbo].[FluentLanguages] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [FluentLanguages_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [FluentLanguages_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [FluentLanguages_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FluentLanguages_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[ProfileFluentLanguages] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [FluentLanguagesId] INT NOT NULL CONSTRAINT [ProfileFluentLanguages_FluentLanguagesId_df] DEFAULT 1,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileFluentLanguages_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileFluentLanguages_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ProfileFluentLanguages_pkey] PRIMARY KEY CLUSTERED ([id])
);



-- CreateIndex
ALTER TABLE [dbo].[locale] ADD CONSTRAINT [locale_Name_key] UNIQUE NONCLUSTERED ([Name]);

-- CreateIndex
ALTER TABLE [dbo].[PhoneType] ADD CONSTRAINT [PhoneType_Name_key] UNIQUE NONCLUSTERED ([Name]);

-- CreateIndex
ALTER TABLE [dbo].[TimeZone] ADD CONSTRAINT [TimeZone_Name_key] UNIQUE NONCLUSTERED ([Name]);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileFluentLanguages] ADD CONSTRAINT [ProfileFluentLanguages_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileFluentLanguages] ADD CONSTRAINT [ProfileFluentLanguages_FluentLanguagesId_fkey] FOREIGN KEY ([FluentLanguagesId]) REFERENCES [dbo].[FluentLanguages]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
