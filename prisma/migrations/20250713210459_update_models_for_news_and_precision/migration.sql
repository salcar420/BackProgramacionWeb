/*
  Warnings:

  - You are about to alter the column `nombre` on the `Categoria` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `title` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `publisher` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `News` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `code` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `Plataforma` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `stars` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - A unique constraint covering the columns `[nombre]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Plataforma` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categoria" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "publisher" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "imageUrl" VARCHAR(255),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "code" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Plataforma" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "stars" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Plataforma_nombre_key" ON "Plataforma"("nombre");
