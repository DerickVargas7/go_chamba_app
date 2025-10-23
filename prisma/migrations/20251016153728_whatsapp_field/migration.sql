/*
  Warnings:

  - You are about to drop the column `iconoUrl` on the `oficios` table. All the data in the column will be lost.
  - You are about to drop the column `esPrincipal` on the `trabajador_oficios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "oficios" DROP COLUMN "iconoUrl";

-- AlterTable
ALTER TABLE "trabajador_oficios" DROP COLUMN "esPrincipal";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "tiene_whatsapp" BOOLEAN NOT NULL DEFAULT false;
