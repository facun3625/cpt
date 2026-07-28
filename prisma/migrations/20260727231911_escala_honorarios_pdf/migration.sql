
-- CreateTable
CREATE TABLE "EscalaHonorariosArchivo" (
    "id" TEXT NOT NULL DEFAULT 'escala-honorarios',
    "url" TEXT NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscalaHonorariosArchivo_pkey" PRIMARY KEY ("id")
);

