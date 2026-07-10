"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { sendMail } from "@/lib/mailer";

const PATH = "/admin/smtp";

export type TestEmailState = { success?: string; error?: string } | undefined;

export async function updateSmtpSettings(formData: FormData) {
  await verifyAdminSession();

  const host = String(formData.get("host") ?? "").trim() || null;
  const portRaw = String(formData.get("port") ?? "").trim();
  const port = portRaw ? Number(portRaw) : 587;
  const secure = formData.get("secure") === "on";
  const user = String(formData.get("user") ?? "").trim() || null;
  const fromEmail = String(formData.get("fromEmail") ?? "").trim() || null;
  const fromName = String(formData.get("fromName") ?? "").trim() || null;
  const passwordRaw = String(formData.get("password") ?? "");

  const existing = await prisma.smtpSettings.findUnique({ where: { id: "smtp" } });
  const password = passwordRaw.trim() ? passwordRaw : (existing?.password ?? null);

  await prisma.smtpSettings.upsert({
    where: { id: "smtp" },
    update: { host, port, secure, user, password, fromEmail, fromName },
    create: { id: "smtp", host, port, secure, user, password, fromEmail, fromName },
  });

  redirect(`${PATH}?ok=1`);
}

export async function sendTestEmail(_prevState: TestEmailState, formData: FormData): Promise<TestEmailState> {
  await verifyAdminSession();

  const to = String(formData.get("testTo") ?? "").trim();
  if (!to) return { error: "Ingresá un email de destino para la prueba." };

  const result = await sendMail({
    to,
    subject: "Prueba de configuración SMTP — CPT Santa Fe",
    text: "Si estás leyendo esto, la configuración SMTP del sitio de CPT Santa Fe funciona correctamente.",
  });

  if (!result.ok) return { error: result.error };
  return { success: `Email de prueba enviado a ${to}.` };
}
