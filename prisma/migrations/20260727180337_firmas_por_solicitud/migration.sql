
-- AlterTable
ALTER TABLE "Firma" DROP COLUMN "enCertificado",
DROP COLUMN "enCredencial";

-- CreateTable
CREATE TABLE "_CertificadoSolicitudToFirma" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CertificadoSolicitudToFirma_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CredencialSolicitudToFirma" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CredencialSolicitudToFirma_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CertificadoSolicitudToFirma_B_index" ON "_CertificadoSolicitudToFirma"("B");

-- CreateIndex
CREATE INDEX "_CredencialSolicitudToFirma_B_index" ON "_CredencialSolicitudToFirma"("B");

-- AddForeignKey
ALTER TABLE "_CertificadoSolicitudToFirma" ADD CONSTRAINT "_CertificadoSolicitudToFirma_A_fkey" FOREIGN KEY ("A") REFERENCES "CertificadoSolicitud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificadoSolicitudToFirma" ADD CONSTRAINT "_CertificadoSolicitudToFirma_B_fkey" FOREIGN KEY ("B") REFERENCES "Firma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CredencialSolicitudToFirma" ADD CONSTRAINT "_CredencialSolicitudToFirma_A_fkey" FOREIGN KEY ("A") REFERENCES "CredencialSolicitud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CredencialSolicitudToFirma" ADD CONSTRAINT "_CredencialSolicitudToFirma_B_fkey" FOREIGN KEY ("B") REFERENCES "Firma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

