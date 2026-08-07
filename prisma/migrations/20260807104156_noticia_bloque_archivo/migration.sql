-- AlterEnum
ALTER TYPE "NoticiaBloqueTipo" ADD VALUE 'ARCHIVO';

-- AlterTable
ALTER TABLE "NoticiaBloque" ADD COLUMN "archivoUrl" TEXT;
ALTER TABLE "NoticiaBloque" ADD COLUMN "archivoNombre" TEXT;
