-- CreateEnum
CREATE TYPE "TipoLocalidad" AS ENUM ('CIUDAD', 'LOCALIDAD');

-- AlterTable
ALTER TABLE "CertificadoSolicitud" ADD COLUMN "tipoLocalidad" "TipoLocalidad" NOT NULL DEFAULT 'CIUDAD';
