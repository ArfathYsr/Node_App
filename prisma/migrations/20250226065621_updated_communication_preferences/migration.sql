/*
  Warnings:

  - You are about to drop the column `StateOfLicense` on the `HcpBioProfessional` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[HcpBioProfessional] DROP COLUMN [StateOfLicense];

-- CreateTable
CREATE TABLE [dbo].[CallDay] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(20) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CallDay_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CallDay_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CallTime] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(20) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CallTime_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CallTime_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EmailDay] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(20) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [EmailDay_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [EmailDay_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EmailTime] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(20) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [EmailTime_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [EmailTime_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SmsDay] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(20) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [SmsDay_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [SmsDay_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SmsTime] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(20) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [SmsTime_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [SmsTime_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CommunicationPreferencesCallDay] (
    [communicationPreferencesId] INT NOT NULL,
    [callDayId] INT NOT NULL,
    CONSTRAINT [CommunicationPreferencesCallDay_pkey] PRIMARY KEY CLUSTERED ([communicationPreferencesId],[callDayId])
);

-- CreateTable
CREATE TABLE [dbo].[CommunicationPreferencesCallTime] (
    [communicationPreferencesId] INT NOT NULL,
    [callTimeId] INT NOT NULL,
    CONSTRAINT [CommunicationPreferencesCallTime_pkey] PRIMARY KEY CLUSTERED ([communicationPreferencesId],[callTimeId])
);

-- CreateTable
CREATE TABLE [dbo].[CommunicationPreferencesEmailDay] (
    [communicationPreferencesId] INT NOT NULL,
    [emailDayId] INT NOT NULL,
    CONSTRAINT [CommunicationPreferencesEmailDay_pkey] PRIMARY KEY CLUSTERED ([communicationPreferencesId],[emailDayId])
);

-- CreateTable
CREATE TABLE [dbo].[CommunicationPreferencesEmailTime] (
    [communicationPreferencesId] INT NOT NULL,
    [emailTimeId] INT NOT NULL,
    CONSTRAINT [CommunicationPreferencesEmailTime_pkey] PRIMARY KEY CLUSTERED ([communicationPreferencesId],[emailTimeId])
);

-- CreateTable
CREATE TABLE [dbo].[CommunicationPreferencesSmsDay] (
    [communicationPreferencesId] INT NOT NULL,
    [smsDayId] INT NOT NULL,
    CONSTRAINT [CommunicationPreferencesSmsDay_pkey] PRIMARY KEY CLUSTERED ([communicationPreferencesId],[smsDayId])
);

-- CreateTable
CREATE TABLE [dbo].[CommunicationPreferencesSmsTime] (
    [communicationPreferencesId] INT NOT NULL,
    [smsTimeId] INT NOT NULL,
    CONSTRAINT [CommunicationPreferencesSmsTime_pkey] PRIMARY KEY CLUSTERED ([communicationPreferencesId],[smsTimeId])
);

-- CreateTable
CREATE TABLE [dbo].[CommunicationPreferences] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [PhoneTypeID] INT NOT NULL,
    [InternationalPrefixID] INT NOT NULL,
    [PhoneNumber] NVARCHAR(1000) NOT NULL,
    [PhoneNumberExtension] NVARCHAR(1000),
    [FaxNumber] NVARCHAR(1000),
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CommunicationPreferences_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [CommunicationPreferences_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CommunicationPreferences_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesCallDay] ADD CONSTRAINT [CommunicationPreferencesCallDay_communicationPreferencesId_fkey] FOREIGN KEY ([communicationPreferencesId]) REFERENCES [dbo].[CommunicationPreferences]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesCallDay] ADD CONSTRAINT [CommunicationPreferencesCallDay_callDayId_fkey] FOREIGN KEY ([callDayId]) REFERENCES [dbo].[CallDay]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesCallTime] ADD CONSTRAINT [CommunicationPreferencesCallTime_communicationPreferencesId_fkey] FOREIGN KEY ([communicationPreferencesId]) REFERENCES [dbo].[CommunicationPreferences]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesCallTime] ADD CONSTRAINT [CommunicationPreferencesCallTime_callTimeId_fkey] FOREIGN KEY ([callTimeId]) REFERENCES [dbo].[CallTime]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesEmailDay] ADD CONSTRAINT [CommunicationPreferencesEmailDay_communicationPreferencesId_fkey] FOREIGN KEY ([communicationPreferencesId]) REFERENCES [dbo].[CommunicationPreferences]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesEmailDay] ADD CONSTRAINT [CommunicationPreferencesEmailDay_emailDayId_fkey] FOREIGN KEY ([emailDayId]) REFERENCES [dbo].[EmailDay]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesEmailTime] ADD CONSTRAINT [CommunicationPreferencesEmailTime_communicationPreferencesId_fkey] FOREIGN KEY ([communicationPreferencesId]) REFERENCES [dbo].[CommunicationPreferences]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesEmailTime] ADD CONSTRAINT [CommunicationPreferencesEmailTime_emailTimeId_fkey] FOREIGN KEY ([emailTimeId]) REFERENCES [dbo].[EmailTime]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesSmsDay] ADD CONSTRAINT [CommunicationPreferencesSmsDay_communicationPreferencesId_fkey] FOREIGN KEY ([communicationPreferencesId]) REFERENCES [dbo].[CommunicationPreferences]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesSmsDay] ADD CONSTRAINT [CommunicationPreferencesSmsDay_smsDayId_fkey] FOREIGN KEY ([smsDayId]) REFERENCES [dbo].[SmsDay]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesSmsTime] ADD CONSTRAINT [CommunicationPreferencesSmsTime_communicationPreferencesId_fkey] FOREIGN KEY ([communicationPreferencesId]) REFERENCES [dbo].[CommunicationPreferences]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferencesSmsTime] ADD CONSTRAINT [CommunicationPreferencesSmsTime_smsTimeId_fkey] FOREIGN KEY ([smsTimeId]) REFERENCES [dbo].[SmsTime]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferences] ADD CONSTRAINT [CommunicationPreferences_InternationalPrefixID_fkey] FOREIGN KEY ([InternationalPrefixID]) REFERENCES [dbo].[InternationalPrefix]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferences] ADD CONSTRAINT [CommunicationPreferences_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CommunicationPreferences] ADD CONSTRAINT [CommunicationPreferences_PhoneTypeID_fkey] FOREIGN KEY ([PhoneTypeID]) REFERENCES [dbo].[PhoneType]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
