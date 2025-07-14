-- DropIndex
DROP INDEX "Game_title_key";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "videoUrls" TEXT[];
