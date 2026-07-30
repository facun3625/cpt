-- CreateEnum
CREATE TYPE "NoticiaBloqueTipo" AS ENUM ('TEXTO', 'IMAGEN');

-- CreateTable
CREATE TABLE "NoticiaBloque" (
    "id" TEXT NOT NULL,
    "noticiaId" TEXT NOT NULL,
    "tipo" "NoticiaBloqueTipo" NOT NULL,
    "texto" TEXT,
    "imagenUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NoticiaBloque_pkey" PRIMARY KEY ("id")
);

-- AlterTable: orden manual para el listado de noticias/capacitaciones
ALTER TABLE "Noticia" ADD COLUMN "orden" INTEGER NOT NULL DEFAULT 0;

-- Inicializa "orden" respetando el orden actual (más reciente primero), por tipo
UPDATE "Noticia" n
SET "orden" = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY tipo ORDER BY "publicadoEn" DESC) - 1 AS rn
  FROM "Noticia"
) sub
WHERE n.id = sub.id;

-- Migra el contenido existente de "texto" a un bloque de tipo TEXTO
INSERT INTO "NoticiaBloque" ("id", "noticiaId", "tipo", "texto", "imagenUrl", "orden")
SELECT md5(random()::text || clock_timestamp()::text || id), id, 'TEXTO', "texto", NULL, 0
FROM "Noticia"
WHERE "texto" IS NOT NULL AND "texto" <> '';

-- Migra las imágenes de la galería existente a bloques de tipo IMAGEN, a continuación del texto
INSERT INTO "NoticiaBloque" ("id", "noticiaId", "tipo", "texto", "imagenUrl", "orden")
SELECT md5(random()::text || clock_timestamp()::text || "NoticiaImagen".id), "noticiaId", 'IMAGEN', NULL, "url", "orden" + 1
FROM "NoticiaImagen";

-- Ya migrado el contenido: se puede eliminar la columna vieja y la tabla de galería
ALTER TABLE "Noticia" DROP COLUMN "texto";

-- DropForeignKey
ALTER TABLE "NoticiaImagen" DROP CONSTRAINT "NoticiaImagen_noticiaId_fkey";

-- DropTable
DROP TABLE "NoticiaImagen";

-- AddForeignKey
ALTER TABLE "NoticiaBloque" ADD CONSTRAINT "NoticiaBloque_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "Noticia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
