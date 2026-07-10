"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { getFirmasCredencial } from "@/lib/site-info";
import { generateCredencialPdf } from "@/lib/credencial-pdf";
import { saveCredencialPdf } from "@/lib/upload";
import { sendMail } from "@/lib/mailer";

const PATH = "/admin/credenciales";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function updateSolicitud(id: string, formData: FormData) {
  await verifyAdminSession();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const numeroMatricula = String(formData.get("numeroMatricula") ?? "").trim();
  const numeroDocumento = String(formData.get("numeroDocumento") ?? "").trim();
  const fechaRaw = String(formData.get("fechaMatriculacion") ?? "").trim();
  const tituloProfesional = String(formData.get("tituloProfesional") ?? "").trim() || null;

  if (!nombre || !apellido || !numeroMatricula || !numeroDocumento) return;

  await prisma.credencialSolicitud.update({
    where: { id },
    data: {
      nombre,
      apellido,
      numeroMatricula,
      numeroDocumento,
      fechaMatriculacion: fechaRaw ? new Date(`${fechaRaw}T00:00:00Z`) : null,
      tituloProfesional,
    },
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

async function emitirCredencial(id: string) {
  const solicitud = await prisma.credencialSolicitud.findUnique({ where: { id } });
  if (!solicitud) return null;

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const verificationUrl = `${siteUrl}/verificar-credencial/${solicitud.codigoVerificacion}`;
  const firmas = await getFirmasCredencial();

  const pdfBuffer = await generateCredencialPdf({
    nombre: solicitud.nombre,
    apellido: solicitud.apellido,
    numeroMatricula: solicitud.numeroMatricula,
    tituloProfesional: solicitud.tituloProfesional,
    fotoUrl: solicitud.fotoUrl,
    codigoVerificacion: solicitud.codigoVerificacion,
    verificationUrl,
    firmas: firmas.map((f) => ({ nombre: f.nombre, titulo: f.titulo, firmaUrl: f.firmaUrl })),
  });

  const credencialUrl = await saveCredencialPdf(pdfBuffer, `${solicitud.codigoVerificacion}.pdf`);
  const expiraEn = new Date(Date.now() + THIRTY_DAYS_MS);

  await prisma.credencialSolicitud.update({
    where: { id },
    data: { estado: "APROBADO", credencialUrl, expiraEn, revisadoEn: new Date() },
  });

  return { solicitud, credencialUrl, siteUrl };
}

export async function aprobarSolicitud(id: string) {
  await verifyAdminSession();

  const result = await emitirCredencial(id);
  if (!result) return;
  const { solicitud, credencialUrl, siteUrl } = result;

  await sendMail({
    to: solicitud.email,
    subject: "Tu credencial digital fue aprobada — CPT Santa Fe",
    text: `Hola ${solicitud.nombre},\n\nTu solicitud de credencial digital fue aprobada.\n\nPodés descargarla desde este enlace (válido por 30 días):\n${siteUrl}${credencialUrl}\n\nSaludos,\nCPT Santa Fe`,
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

export async function rechazarSolicitud(id: string, formData: FormData) {
  await verifyAdminSession();

  const motivoRechazo = String(formData.get("motivoRechazo") ?? "").trim();
  if (!motivoRechazo) return;

  const solicitud = await prisma.credencialSolicitud.update({
    where: { id },
    data: { estado: "RECHAZADO", motivoRechazo, revisadoEn: new Date() },
  });

  await sendMail({
    to: solicitud.email,
    subject: "Tu solicitud de credencial digital fue rechazada — CPT Santa Fe",
    text: `Hola ${solicitud.nombre},\n\nTu solicitud de credencial digital fue rechazada.\n\nMotivo: ${motivoRechazo}\n\nAnte cualquier consulta, contactate con la secretaría del Colegio.\n\nSaludos,\nCPT Santa Fe`,
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

export async function regenerarCredencial(id: string) {
  await verifyAdminSession();

  const result = await emitirCredencial(id);
  if (!result) return;

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

export async function reenviarEnlace(id: string) {
  await verifyAdminSession();

  const solicitud = await prisma.credencialSolicitud.findUnique({ where: { id } });
  if (!solicitud || solicitud.estado !== "APROBADO" || !solicitud.credencialUrl) return;

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  await sendMail({
    to: solicitud.email,
    subject: "Tu credencial digital — CPT Santa Fe",
    text: `Hola ${solicitud.nombre},\n\nTe reenviamos el enlace de tu credencial digital:\n${siteUrl}${solicitud.credencialUrl}\n\nSaludos,\nCPT Santa Fe`,
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

export async function revocarCredencial(id: string) {
  await verifyAdminSession();

  await prisma.credencialSolicitud.update({
    where: { id },
    data: { estado: "REVOCADO", revisadoEn: new Date() },
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}
