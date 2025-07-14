/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Plataforma` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plataforma" DROP COLUMN "descripcion",
ADD COLUMN     "image" TEXT;
