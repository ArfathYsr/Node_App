BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[VendorRoom] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [VendorID] INT NOT NULL,
    [RoomName] VARCHAR(255) NOT NULL,
    [MaxCapicity] INT NOT NULL,
    [RentalFee] FLOAT(53) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorRoom_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorRoom_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VendorRoom_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[VendorVenue] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [VendorID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [Phone] VARCHAR(255) NOT NULL,
    [Email] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorVenue_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorVenue_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VendorVenue_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[QuestionCategory] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionCategory_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionCategory_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [QuestionCategory_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[QuestionType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [QuestionType_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Question] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [QuestionCategoryId] INT NOT NULL,
    [QuestionTypeId] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [isMultiple] BIT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Question_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Question_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Question_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[QuestionOption] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [QuestionId] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [isMultiple] BIT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionOption_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionOption_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [QuestionOption_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[VendorAdditionalSetting] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [VendorID] INT NOT NULL,
    [QuestionCategoryId] INT NOT NULL,
    [QuestionTypeId] INT NOT NULL,
    [QuestionId] INT NOT NULL,
    [Value] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorAdditionalSetting_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorAdditionalSetting_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VendorAdditionalSetting_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[VendorRoom] ADD CONSTRAINT [VendorRoom_VendorID_fkey] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorVenue] ADD CONSTRAINT [VendorVenue_VendorID_fkey] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_QuestionCategoryId_fkey] FOREIGN KEY ([QuestionCategoryId]) REFERENCES [dbo].[QuestionCategory]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_QuestionTypeId_fkey] FOREIGN KEY ([QuestionTypeId]) REFERENCES [dbo].[QuestionType]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[QuestionOption] ADD CONSTRAINT [QuestionOption_QuestionId_fkey] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] ADD CONSTRAINT [VendorAdditionalSetting_VendorID_fkey] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] ADD CONSTRAINT [VendorAdditionalSetting_QuestionCategoryId_fkey] FOREIGN KEY ([QuestionCategoryId]) REFERENCES [dbo].[QuestionCategory]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] ADD CONSTRAINT [VendorAdditionalSetting_QuestionTypeId_fkey] FOREIGN KEY ([QuestionTypeId]) REFERENCES [dbo].[QuestionType]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VendorAdditionalSetting] ADD CONSTRAINT [VendorAdditionalSetting_QuestionId_fkey] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
