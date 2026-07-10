-- CreateTable
CREATE TABLE "ArancelesInfo" (
    "id" TEXT NOT NULL DEFAULT 'aranceles',
    "vigenciaFecha" TEXT NOT NULL,
    "numeroBase" INTEGER NOT NULL,

    CONSTRAINT "ArancelesInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArancelGrupo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "esHonorarioMinimo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ArancelGrupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArancelItem" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArancelItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArancelItem" ADD CONSTRAINT "ArancelItem_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "ArancelGrupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

