-- CreateEnum
CREATE TYPE "NoticiaTipo" AS ENUM ('NOTICIA', 'CAPACITACION');

-- CreateTable
CREATE TABLE "Noticia" (
    "id" TEXT NOT NULL,
    "tipo" "NoticiaTipo" NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "pretexto" TEXT,
    "texto" TEXT,
    "imagenDestacada" TEXT,
    "video" TEXT,
    "enSliderHome" BOOLEAN NOT NULL DEFAULT false,
    "publicadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoticiaImagen" (
    "id" TEXT NOT NULL,
    "noticiaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NoticiaImagen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Noticia_slug_key" ON "Noticia"("slug");

-- AddForeignKey
ALTER TABLE "NoticiaImagen" ADD CONSTRAINT "NoticiaImagen_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "Noticia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

