-- CreateEnum
CREATE TYPE "ModalidadTrabajo" AS ENUM ('PRESENCIAL', 'REMOTO', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "BusquedaEstado" AS ENUM ('ACTIVA', 'CERRADA');

-- CreateTable
CREATE TABLE "Especialidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TecnicoBolsa" (
    "id" TEXT NOT NULL,
    "numeroMatricula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "disponibilidad" TEXT,
    "observaciones" TEXT,
    "mostrarTelefono" BOOLEAN NOT NULL DEFAULT true,
    "mostrarEmail" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "especialidadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TecnicoBolsa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusquedaLaboral" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "modalidad" "ModalidadTrabajo" NOT NULL DEFAULT 'PRESENCIAL',
    "contacto" TEXT NOT NULL,
    "estado" "BusquedaEstado" NOT NULL DEFAULT 'ACTIVA',
    "fechaCierre" TIMESTAMP(3),
    "especialidadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusquedaLaboral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

-- AddForeignKey
ALTER TABLE "TecnicoBolsa" ADD CONSTRAINT "TecnicoBolsa_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusquedaLaboral" ADD CONSTRAINT "BusquedaLaboral_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

