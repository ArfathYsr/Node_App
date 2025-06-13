BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ProfileTheme] (
    [id] INT NOT NULL IDENTITY(1,1),
    [profileId] INT NOT NULL,
    [interfaceThemeID] INT NOT NULL,
    [brandColorCode] VARCHAR(7) NOT NULL,
    [createdBy] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ProfileTheme_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedBy] INT NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ProfileTheme_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BrandColor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ColorCode] VARCHAR(7) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [BrandColor_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [BrandColor_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [BrandColor_ColorCode_key] UNIQUE NONCLUSTERED ([ColorCode])
);

-- CreateTable
CREATE TABLE [dbo].[Interfacetheme] (
    [interfaceThemeID] INT NOT NULL IDENTITY(1,1),
    [ThemeName] VARCHAR(255) NOT NULL,
    [ThemeImageUrl] VARCHAR(255) NOT NULL,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Interfacetheme_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] INT NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Interfacetheme_pkey] PRIMARY KEY CLUSTERED ([interfaceThemeID])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileTheme] ADD CONSTRAINT [ProfileTheme_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[Profile]([ID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileTheme] ADD CONSTRAINT [ProfileTheme_interfaceThemeID_fkey] FOREIGN KEY ([interfaceThemeID]) REFERENCES [dbo].[Interfacetheme]([interfaceThemeID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileTheme] ADD CONSTRAINT [ProfileTheme_brandColorCode_fkey] FOREIGN KEY ([brandColorCode]) REFERENCES [dbo].[BrandColor]([ColorCode]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
