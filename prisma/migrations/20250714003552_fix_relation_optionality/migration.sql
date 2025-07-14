/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformGame` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `Categoria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publisher` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estado` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `Plataforma` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `content` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estado` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_gameId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformGame" DROP CONSTRAINT "PlatformGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformGame" DROP CONSTRAINT "PlatformGame_plataformaId_fkey";

-- DropIndex
DROP INDEX "Categoria_nombre_key";

-- DropIndex
DROP INDEX "Game_title_key";

-- DropIndex
DROP INDEX "News_title_key";

-- DropIndex
DROP INDEX "Plataforma_nombre_key";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "createdAt",
DROP COLUMN "quantity",
DROP COLUMN "updatedAt",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Categoria" ALTER COLUMN "nombre" SET NOT NULL;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "categoryId",
DROP COLUMN "imageUrl",
DROP COLUMN "stock",
DROP COLUMN "updatedAt",
ADD COLUMN     "categoriaId" INTEGER,
ADD COLUMN     "estaOferta" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plataformaId" INTEGER,
ALTER COLUMN "publisher" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "estado" SET NOT NULL,
ALTER COLUMN "estado" SET DEFAULT true;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "photo",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "gameId" INTEGER,
ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "Plataforma" ALTER COLUMN "nombre" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "comment",
DROP COLUMN "createdAt",
DROP COLUMN "rating",
DROP COLUMN "updatedAt",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "stars" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
DROP COLUMN "updatedAt",
ADD COLUMN     "token" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "estado" SET NOT NULL,
ALTER COLUMN "estado" SET DEFAULT true;

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "PlatformGame";

-- CreateIndex
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "Plataforma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
