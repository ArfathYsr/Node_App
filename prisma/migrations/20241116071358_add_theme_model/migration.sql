-- Create the BrandColor table
CREATE TABLE BrandColor (
    id INT PRIMARY KEY IDENTITY(1,1),
    colorCode VARCHAR(7) NOT NULL UNIQUE, -- Unique constraint for color codes
    createdBy INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedBy INT NOT NULL,
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create the InterfaceTheme table
CREATE TABLE InterfaceTheme (
    id INT PRIMARY KEY IDENTITY(1,1),
    themeName VARCHAR(255) NOT NULL,
    themeImageUrl VARCHAR(255),
    createdBy INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedBy INT NOT NULL,
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create the ProfileTheme table
CREATE TABLE ProfileTheme (
    id INT PRIMARY KEY IDENTITY(1,1),
    profileId INT NOT NULL, -- Foreign key to the Profile table
    themeId INT NOT NULL, -- Foreign key to the InterfaceTheme table
    brandColorCode VARCHAR(7) NOT NULL, -- Foreign key to the BrandColor table
    createdBy INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedBy INT NOT NULL,
    updatedAt DATETIME DEFAULT GETDATE(),

    -- Add Foreign Key Constraints
    CONSTRAINT FK_ProfileTheme_Profile FOREIGN KEY (profileId) REFERENCES Profile(id),
    CONSTRAINT FK_ProfileTheme_Theme FOREIGN KEY (themeId) REFERENCES InterfaceTheme(id),
    CONSTRAINT FK_ProfileTheme_BrandColor FOREIGN KEY (brandColorCode) REFERENCES BrandColor(colorCode)
);
