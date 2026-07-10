-- CreateTable
CREATE TABLE "ValorM2" (
    "id" TEXT NOT NULL DEFAULT 'valor-m2',
    "valorVigente" INTEGER NOT NULL,
    "vigenteHasta" TEXT,
    "valorProximo" INTEGER,
    "proximoDesde" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValorM2_pkey" PRIMARY KEY ("id")
);

