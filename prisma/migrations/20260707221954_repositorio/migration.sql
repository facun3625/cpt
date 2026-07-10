-- CreateTable
CREATE TABLE "RepositorioArchivo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "tamano" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepositorioArchivo_pkey" PRIMARY KEY ("id")
);

