-- CreateTable
CREATE TABLE "SmtpSettings" (
    "id" TEXT NOT NULL DEFAULT 'smtp',
    "host" TEXT,
    "port" INTEGER NOT NULL DEFAULT 587,
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "user" TEXT,
    "password" TEXT,
    "fromEmail" TEXT,
    "fromName" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmtpSettings_pkey" PRIMARY KEY ("id")
);

