-- CreateEnum
CREATE TYPE "SolicitudEstado" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- DropIndex
DROP INDEX "MatriculadoHabilitado_numeroMatricula_idx";

-- AlterTable
ALTER TABLE "MatriculadoHabilitado" ADD COLUMN     "fechaMatriculacion" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CertificadoFirma" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "firmaUrl" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CertificadoFirma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificadoSolicitud" (
    "id" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "numeroMatricula" TEXT NOT NULL,
    "fechaMatriculacion" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "lugarPresentacion" TEXT NOT NULL,
    "observaciones" TEXT,
    "estado" "SolicitudEstado" NOT NULL DEFAULT 'PENDIENTE',
    "motivoRechazo" TEXT,
    "codigoVerificacion" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "expiraEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revisadoEn" TIMESTAMP(3),

    CONSTRAINT "CertificadoSolicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificadoSolicitud_codigoVerificacion_key" ON "CertificadoSolicitud"("codigoVerificacion");

-- CreateIndex
CREATE UNIQUE INDEX "MatriculadoHabilitado_numeroMatricula_key" ON "MatriculadoHabilitado"("numeroMatricula");

