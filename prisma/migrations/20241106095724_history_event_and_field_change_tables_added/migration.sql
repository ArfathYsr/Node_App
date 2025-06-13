BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[HistoryEvent] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [RecordType] VARCHAR(20) NOT NULL,
    [RecordID] INT NOT NULL,
    [ChangedBy] INT NOT NULL,
    [ChangedAt] DATETIME2 NOT NULL CONSTRAINT [HistoryEvent_ChangedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HistoryEvent_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[FieldChange] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [HistoryEventID] INT NOT NULL,
    [Field] VARCHAR(20) NOT NULL,
    [PreviousValue] VARCHAR(255),
    [NewValue] VARCHAR(255),
    CONSTRAINT [FieldChange_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [HistoryEvent_RecordType_RecordID_idx] ON [dbo].[HistoryEvent]([RecordType], [RecordID]);

-- AddForeignKey
ALTER TABLE [dbo].[FieldChange] ADD CONSTRAINT [FieldChange_HistoryEventID_fkey] FOREIGN KEY ([HistoryEventID]) REFERENCES [dbo].[HistoryEvent]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
