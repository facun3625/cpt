import "server-only";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function getMailTransporter() {
  const settings = await prisma.smtpSettings.findUnique({ where: { id: "smtp" } });
  if (!settings?.host || !settings.user || !settings.password) return null;

  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: { user: settings.user, pass: settings.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });

  const from = settings.fromName
    ? `"${settings.fromName}" <${settings.fromEmail || settings.user}>`
    : settings.fromEmail || settings.user;

  return { transporter, from };
}

export async function sendMail(options: { to: string; subject: string; text?: string; html?: string }) {
  const mail = await getMailTransporter();
  if (!mail) {
    return { ok: false as const, error: "El envío de correo todavía no está configurado." };
  }

  try {
    await mail.transporter.sendMail({ from: mail.from, ...options });
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido al enviar el correo.";
    return { ok: false as const, error: message };
  }
}
