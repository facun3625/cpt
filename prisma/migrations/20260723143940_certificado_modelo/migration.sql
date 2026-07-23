
-- CreateEnum
CREATE TYPE "CertificadoModelo" AS ENUM ('ANUAL', 'CUOTAS');

-- AlterTable
ALTER TABLE "CertificadoSolicitud" ADD COLUMN     "cantidadCuotas" INTEGER,
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "cuotaVencimientoAnio" INTEGER,
ADD COLUMN     "cuotaVencimientoMes" INTEGER,
ADD COLUMN     "modelo" "CertificadoModelo";

