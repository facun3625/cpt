-- CreateEnum
CREATE TYPE "CredencialEstado" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REVOCADO');

-- RenameTable (preserva las firmas ya cargadas)
ALTER TABLE "CertificadoFirma" RENAME TO "Firma";
ALTER TABLE "Firma" RENAME CONSTRAINT "CertificadoFirma_pkey" TO "Firma_pkey";

-- CreateTable
CREATE TABLE "CredencialSolicitud" (
    "id" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "numeroMatricula" TEXT NOT NULL,
    "fechaMatriculacion" TIMESTAMP(3),
    "tituloProfesional" TEXT,
    "email" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "estado" "CredencialEstado" NOT NULL DEFAULT 'PENDIENTE',
    "motivoRechazo" TEXT,
    "codigoVerificacion" TEXT NOT NULL,
    "credencialUrl" TEXT,
    "expiraEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revisadoEn" TIMESTAMP(3),

    CONSTRAINT "CredencialSolicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CredencialSolicitud_codigoVerificacion_key" ON "CredencialSolicitud"("codigoVerificacion");

