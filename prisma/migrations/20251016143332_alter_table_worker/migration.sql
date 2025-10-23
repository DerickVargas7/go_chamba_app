/*
  Warnings:

  - You are about to drop the column `añosExperiencia` on the `perfiles_trabajador` table. All the data in the column will be lost.
  - You are about to drop the column `tarifaPorHora` on the `perfiles_trabajador` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[carnetIdentidad]` on the table `perfiles_trabajador` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carnetIdentidad` to the `perfiles_trabajador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `perfiles_trabajador` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "servicios" DROP CONSTRAINT "servicios_trabajadorOficioId_fkey";

-- AlterTable
ALTER TABLE "perfiles_trabajador" DROP COLUMN "añosExperiencia",
DROP COLUMN "tarifaPorHora",
ADD COLUMN     "carnetIdentidad" TEXT NOT NULL,
ADD COLUMN     "descripcion" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_trabajador_carnetIdentidad_key" ON "perfiles_trabajador"("carnetIdentidad");
