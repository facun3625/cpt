-- AlterTable
ALTER TABLE "Firma" ADD COLUMN     "enCertificado" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enCredencial" BOOLEAN NOT NULL DEFAULT false;

