/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Plataforma` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plataforma_nombre_key" ON "Plataforma"("nombre");
