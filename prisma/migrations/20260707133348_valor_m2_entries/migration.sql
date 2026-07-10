-- AlterTable
ALTER TABLE "ArancelesInfo" DROP COLUMN "numeroBase";

-- DropTable
DROP TABLE "ValorM2";

-- CreateTable
CREATE TABLE "ValorM2Entry" (
    "id" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "vigenteDesde" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValorM2Entry_pkey" PRIMARY KEY ("id")
);

