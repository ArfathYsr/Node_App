BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[LoginDetails] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [ApplicationName] VARCHAR(40),
    [BrowserName] VARCHAR(40),
    [Device] VARCHAR(40),
    [Duration] DATETIME2,
    [LoggedinAt] DATETIME2 NOT NULL CONSTRAINT [LoginDetails_LoggedinAt_df] DEFAULT CURRENT_TIMESTAMP,
    [IsLoginSuccess] BIT NOT NULL CONSTRAINT [LoginDetails_IsLoginSuccess_df] DEFAULT 0,
    [LoginUrl] VARCHAR(255),
    [SourceIp] VARCHAR(20),
    [Country] VARCHAR(40),
    CONSTRAINT [LoginDetails_pkey] PRIMARY KEY CLUSTERED ([ID])
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
