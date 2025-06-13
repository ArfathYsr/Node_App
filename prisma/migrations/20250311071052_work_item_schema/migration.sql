BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[WorkItem] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(255) NOT NULL,
    [ActionTypeId] INT NOT NULL,
    [StatusId] INT NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [WorkItem_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [WorkItem_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [WorkItem_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [WorkItem_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[WorkItemActionType] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [WorkItemActionType_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [WorkItemActionType_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [WorkItemActionType_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [WorkItemActionType_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[WorkItemStatus] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [WorkItemStatus_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [WorkItemStatus_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [WorkItemStatus_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [WorkItemStatus_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceTypeWorkItem] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ServiceTypeId] INT NOT NULL,
    [WorkItemId] INT NOT NULL,
    [Status] BIT NOT NULL CONSTRAINT [ServiceTypeWorkItem_Status_df] DEFAULT 1,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceTypeWorkItem_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ServiceTypeWorkItem_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ServiceTypeWorkItem_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[WorkItem] ADD CONSTRAINT [WorkItem_ActionTypeId_fkey] FOREIGN KEY ([ActionTypeId]) REFERENCES [dbo].[WorkItemActionType]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[WorkItem] ADD CONSTRAINT [WorkItem_StatusId_fkey] FOREIGN KEY ([StatusId]) REFERENCES [dbo].[WorkItemStatus]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceTypeWorkItem] ADD CONSTRAINT [ServiceTypeWorkItem_ServiceTypeId_fkey] FOREIGN KEY ([ServiceTypeId]) REFERENCES [dbo].[ServiceType]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceTypeWorkItem] ADD CONSTRAINT [ServiceTypeWorkItem_WorkItemId_fkey] FOREIGN KEY ([WorkItemId]) REFERENCES [dbo].[WorkItem]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
