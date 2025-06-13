/*
  Warnings:

  - You are about to drop the column `IsActive` on the `PermissionGroup` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;
DROP TABLE IF EXISTS [dbo].[Status];
-- AlterTable
ALTER TABLE [dbo].[PermissionGroup] DROP CONSTRAINT PermissionGroup_IsActive_df;
ALTER TABLE [dbo].[PermissionGroup] DROP COLUMN [IsActive];
ALTER TABLE [dbo].[PermissionGroup] ADD [StatusId] INT NOT NULL CONSTRAINT [PermissionGroup_StatusId_df] DEFAULT 1;

-- CreateTable
CREATE TABLE [dbo].[Status] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [StatusName] VARCHAR(255) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Status_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Status_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [Status_pkey] PRIMARY KEY CLUSTERED ([ID])
);

 -- Insert a default record into the Status table
INSERT INTO [dbo].[Status] ([StatusName], [CreatedBy], [UpdatedBy])
    VALUES ('Active', 1, 1);

-- AddForeignKey
ALTER TABLE [dbo].[PermissionGroup] ADD CONSTRAINT [PermissionGroup_StatusId_fkey] FOREIGN KEY ([StatusId]) REFERENCES [dbo].[Status]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
