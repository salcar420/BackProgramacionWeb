/*
  Warnings:

  - You are about to drop the column `image` on the `Plataforma` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plataforma" DROP COLUMN "image",
ADD COLUMN     "descripcion" TEXT;
