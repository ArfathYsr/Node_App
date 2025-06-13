BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[QuestionCategory] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [IsActive] BIT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionCategory_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionCategory_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [QuestionCategory_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[QuestionType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [IsActive] BIT NOT NULL,
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
    [Question] VARCHAR(255) NOT NULL,
    [IsActive] BIT NOT NULL,
    [ParentQuestionID] INT,
    [DisplayOrder] INT NOT NULL,
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
    [Name] VARCHAR(50) NOT NULL,
    [IsActive] BIT NOT NULL,
    [DisplayOrder] INT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionOption_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionOption_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [QuestionOption_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[VendorQuestionResponse] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [VendorId] INT NOT NULL,
    [QuestionId] INT NOT NULL,
    [QuestionOptionId] INT NOT NULL,
    [CustomValue] NVARCHAR(1000) NOT NULL,
    [FileURL] NVARCHAR(1000) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorQuestionResponse_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [VendorQuestionResponse_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VendorQuestionResponse_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[QuestionValidation] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [QuestionId] INT NOT NULL,
    [TypeField] VARCHAR(50) NOT NULL,
    [TypeValue] VARCHAR(50) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionValidation_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [QuestionValidation_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [QuestionValidation_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_ParentQuestionID_fkey] FOREIGN KEY ([ParentQuestionID]) REFERENCES [dbo].[Question]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_QuestionCategoryId_fkey] FOREIGN KEY ([QuestionCategoryId]) REFERENCES [dbo].[QuestionCategory]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_QuestionTypeId_fkey] FOREIGN KEY ([QuestionTypeId]) REFERENCES [dbo].[QuestionType]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[QuestionOption] ADD CONSTRAINT [QuestionOption_QuestionId_fkey] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorQuestionResponse] ADD CONSTRAINT [VendorQuestionResponse_VendorId_fkey] FOREIGN KEY ([VendorId]) REFERENCES [dbo].[Vendor]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VendorQuestionResponse] ADD CONSTRAINT [VendorQuestionResponse_QuestionId_fkey] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VendorQuestionResponse] ADD CONSTRAINT [VendorQuestionResponse_QuestionOptionId_fkey] FOREIGN KEY ([QuestionOptionId]) REFERENCES [dbo].[QuestionOption]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[QuestionValidation] ADD CONSTRAINT [QuestionValidation_QuestionId_fkey] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
