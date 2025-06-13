BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Segmentation] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Segmentation_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Segmentation_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [Segmentation_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [Segmentation_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[ProfileSegmentation] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [ProfileID] INT NOT NULL,
    [SegmentationID] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileSegmentation_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ProfileSegmentation_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] INT NOT NULL,
    [UpdatedBy] INT NOT NULL,
    CONSTRAINT [ProfileSegmentation_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileSegmentation] ADD CONSTRAINT [ProfileSegmentation_ProfileID_fkey] FOREIGN KEY ([ProfileID]) REFERENCES [dbo].[Profile]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileSegmentation] ADD CONSTRAINT [ProfileSegmentation_SegmentationID_fkey] FOREIGN KEY ([SegmentationID]) REFERENCES [dbo].[Segmentation]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
