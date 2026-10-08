-- CreateEnum
CREATE TYPE "EstadoCampania" AS ENUM ('EN_COLA', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoEnvio" AS ENUM ('PENDIENTE', 'ENVIADO', 'FALLIDO');

-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN "html" TEXT,
ADD COLUMN "estado" "EstadoCampania" NOT NULL DEFAULT 'COMPLETADA',
ADD COLUMN "total" INTEGER NOT NULL DEFAULT 0;

-- Las campañas anteriores se enviaron en el momento: su total es lo enviado + lo fallido.
UPDATE "EmailCampaign" SET "total" = "cantidadEnviados" + "cantidadFallidos";

-- CreateTable
CREATE TABLE "EmailEnvio" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "estado" "EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "error" TEXT,
    "enviadoEn" TIMESTAMP(3),

    CONSTRAINT "EmailEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailEnvio_campaignId_estado_idx" ON "EmailEnvio"("campaignId", "estado");

-- CreateIndex
CREATE INDEX "EmailEnvio_enviadoEn_idx" ON "EmailEnvio"("enviadoEn");

-- AddForeignKey
ALTER TABLE "EmailEnvio" ADD CONSTRAINT "EmailEnvio_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
