"use server";

import { prisma } from "@/lib/prisma";

export type SuscribirState = { ok?: true; error?: string } | undefined;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function suscribirNewsletter(_prevState: SuscribirState, formData: FormData): Promise<SuscribirState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: "Ingresá un email válido." };
  }

  await prisma.suscriptor.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  return { ok: true };
}
