-- CreateTable
CREATE TABLE "LinkInteres" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LinkInteres_pkey" PRIMARY KEY ("id")
);

