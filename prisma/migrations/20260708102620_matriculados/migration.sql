-- CreateTable
CREATE TABLE "MatriculadoHabilitado" (
    "id" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "numeroMatricula" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatriculadoHabilitado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatriculadosUpload" (
    "id" TEXT NOT NULL DEFAULT 'matriculados',
    "uploadedAt" TIMESTAMP(3) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "nombreArchivo" TEXT NOT NULL,

    CONSTRAINT "MatriculadosUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatriculadoHabilitado_numeroDocumento_idx" ON "MatriculadoHabilitado"("numeroDocumento");

-- CreateIndex
CREATE INDEX "MatriculadoHabilitado_numeroMatricula_idx" ON "MatriculadoHabilitado"("numeroMatricula");

