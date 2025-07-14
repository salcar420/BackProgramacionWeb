/*
  Warnings:

  - Added the required column `bannerImage` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "bannerImage" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;
