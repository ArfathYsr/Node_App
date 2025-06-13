/*
  Warnings:

  - You are about to drop the column `RecordID` on the `HistoryEvent` table. All the data in the column will be lost.
  - You are about to drop the column `RecordType` on the `HistoryEvent` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [HistoryEvent_RecordType_RecordID_idx] ON [dbo].[HistoryEvent];

-- AlterTable
ALTER TABLE [dbo].[HistoryEvent] DROP COLUMN [RecordID],
[RecordType];
ALTER TABLE [dbo].[HistoryEvent] ADD [ReferenceId] INT NOT NULL CONSTRAINT [HistoryEvent_ReferenceId_df] DEFAULT 0,
[ReferenceType] VARCHAR(20) NOT NULL CONSTRAINT [HistoryEvent_ReferenceType_df] DEFAULT 'DefaultType';

-- CreateIndex
CREATE NONCLUSTERED INDEX [HistoryEvent_ReferenceType_ReferenceId_idx] ON [dbo].[HistoryEvent]([ReferenceType], [ReferenceId]);

-- AddForeignKey
ALTER TABLE [dbo].[HistoryEvent] ADD CONSTRAINT [HistoryEvent_ChangedBy_fkey] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
