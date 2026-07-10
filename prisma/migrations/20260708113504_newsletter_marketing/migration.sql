-- CreateEnum
CREATE TYPE "DestinatarioEmail" AS ENUM ('SUSCRIPTORES', 'MATRICULADOS', 'AMBOS');

-- CreateTable
CREATE TABLE "Suscriptor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suscriptor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "destinatarios" "DestinatarioEmail" NOT NULL,
    "cantidadEnviados" INTEGER NOT NULL DEFAULT 0,
    "cantidadFallidos" INTEGER NOT NULL DEFAULT 0,
    "enviadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Suscriptor_email_key" ON "Suscriptor"("email");

