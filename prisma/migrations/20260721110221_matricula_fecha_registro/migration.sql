
-- CreateTable
CREATE TABLE "MatriculaFechaRegistro" (
    "id" TEXT NOT NULL,
    "numeroMatricula" TEXT NOT NULL,
    "fechaMatriculacion" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatriculaFechaRegistro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatriculaFechaRegistro_numeroMatricula_key" ON "MatriculaFechaRegistro"("numeroMatricula");

