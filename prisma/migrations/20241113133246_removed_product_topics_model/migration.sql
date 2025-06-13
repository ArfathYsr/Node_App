/*
  Warnings:

  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentDuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentFileFormat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EngagementType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TherapeuticAreaProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopicContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopicStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopicType` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Content] DROP CONSTRAINT [Content_ContentDurationID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Content] DROP CONSTRAINT [Content_ContentFileFormatID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Content] DROP CONSTRAINT [Content_ContentStatusID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Content] DROP CONSTRAINT [Content_ContentTypeID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Product] DROP CONSTRAINT [Product_CreatedBy_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Product] DROP CONSTRAINT [Product_ProductStatusID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Product] DROP CONSTRAINT [Product_UpdatedBy_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProductStatus] DROP CONSTRAINT [ProductStatus_CreatedBy_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProductStatus] DROP CONSTRAINT [ProductStatus_UpdatedBy_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProductTopic] DROP CONSTRAINT [ProductTopic_ProductID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProductTopic] DROP CONSTRAINT [ProductTopic_TopicID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TherapeuticAreaProduct] DROP CONSTRAINT [TherapeuticAreaProduct_ProductID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TherapeuticAreaProduct] DROP CONSTRAINT [TherapeuticAreaProduct_TherapeuticAreaID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Topic] DROP CONSTRAINT [Topic_CreatedBy_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Topic] DROP CONSTRAINT [Topic_EngagementTypeID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Topic] DROP CONSTRAINT [Topic_LocationTypeID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Topic] DROP CONSTRAINT [Topic_TopicStatusID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Topic] DROP CONSTRAINT [Topic_TopicTypeID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Topic] DROP CONSTRAINT [Topic_UpdatedBy_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TopicContent] DROP CONSTRAINT [TopicContent_ContentID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TopicContent] DROP CONSTRAINT [TopicContent_TopicID_fkey];

-- DropTable
DROP TABLE [dbo].[Content];

-- DropTable
DROP TABLE [dbo].[ContentDuration];

-- DropTable
DROP TABLE [dbo].[ContentFileFormat];

-- DropTable
DROP TABLE [dbo].[ContentStatus];

-- DropTable
DROP TABLE [dbo].[ContentType];

-- DropTable
DROP TABLE [dbo].[EngagementType];

-- DropTable
DROP TABLE [dbo].[LocationType];

-- DropTable
DROP TABLE [dbo].[Product];

-- DropTable
DROP TABLE [dbo].[ProductStatus];

-- DropTable
DROP TABLE [dbo].[ProductTopic];

-- DropTable
DROP TABLE [dbo].[TherapeuticAreaProduct];

-- DropTable
DROP TABLE [dbo].[Topic];

-- DropTable
DROP TABLE [dbo].[TopicContent];

-- DropTable
DROP TABLE [dbo].[TopicStatus];

-- DropTable
DROP TABLE [dbo].[TopicType];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
