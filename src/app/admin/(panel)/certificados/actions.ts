"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { getFirmasCertificado, getSedes } from "@/lib/site-info";
import { generateCertificadoPdf } from "@/lib/certificado-pdf";
import { saveCertificadoPdf } from "@/lib/upload";
import { sendMail } from "@/lib/mailer";

const PATH = "/admin/certificados";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function updateSolicitud(id: string, formData: FormData) {
  await verifyAdminSession();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const numeroMatricula = String(formData.get("numeroMatricula") ?? "").trim();
  const numeroDocumento = String(formData.get("numeroDocumento") ?? "").trim();
  const lugarPresentacion = String(formData.get("lugarPresentacion") ?? "").trim();
  const observaciones = String(formData.get("observaciones") ?? "").trim() || null;
  const fechaRaw = String(formData.get("fechaMatriculacion") ?? "").trim();
  const tituloProfesional = String(formData.get("tituloProfesional") ?? "").trim() || null;
  const domicilio = String(formData.get("domicilio") ?? "").trim() || null;
  const notasAdicionales = String(formData.get("notasAdicionales") ?? "").trim() || null;

  if (!nombre || !apellido || !numeroMatricula || !numeroDocumento || !lugarPresentacion) return;

  await prisma.certificadoSolicitud.update({
    where: { id },
    data: {
      nombre,
      apellido,
      numeroMatricula,
      numeroDocumento,
      lugarPresentacion,
      observaciones,
      fechaMatriculacion: fechaRaw ? new Date(`${fechaRaw}T00:00:00Z`) : null,
      tituloProfesional,
      domicilio,
      notasAdicionales,
    },
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

export async function aprobarSolicitud(id: string) {
  await verifyAdminSession();

  const solicitud = await prisma.certificadoSolicitud.findUnique({ where: { id } });
  if (!solicitud) return;

  const [firmas, sedes] = await Promise.all([getFirmasCertificado(), getSedes()]);
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const verificationUrl = `${siteUrl}/verificar-certificado/${solicitud.codigoVerificacion}`;

  const pdfBuffer = await generateCertificadoPdf({
    nombre: solicitud.nombre,
    apellido: solicitud.apellido,
    numeroDocumento: solicitud.numeroDocumento,
    numeroMatricula: solicitud.numeroMatricula,
    fechaMatriculacion: solicitud.fechaMatriculacion,
    tituloProfesional: solicitud.tituloProfesional,
    domicilio: solicitud.domicilio,
    lugarPresentacion: solicitud.lugarPresentacion,
    notasAdicionales: solicitud.notasAdicionales,
    codigoVerificacion: solicitud.codigoVerificacion,
    verificationUrl,
    firmas: firmas.map((f) => ({ nombre: f.nombre, titulo: f.titulo, firmaUrl: f.firmaUrl })),
    sede: sedes[0] ? { direccion: sedes[0].direccion, telefono: sedes[0].telefono } : null,
  });

  const pdfUrl = await saveCertificadoPdf(pdfBuffer, `${solicitud.codigoVerificacion}.pdf`);
  const expiraEn = new Date(Date.now() + THIRTY_DAYS_MS);

  await prisma.certificadoSolicitud.update({
    where: { id },
    data: { estado: "APROBADO", pdfUrl, expiraEn, revisadoEn: new Date() },
  });

  await sendMail({
    to: solicitud.email,
    subject: "Tu certificado de matriculación fue aprobado — CPT Santa Fe",
    text: `Hola ${solicitud.nombre},\n\nTu solicitud de certificado de matriculación fue aprobada.\n\nPodés descargarlo desde este enlace (válido por 30 días):\n${siteUrl}${pdfUrl}\n\nSaludos,\nCPT Santa Fe`,
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}

export async function rechazarSolicitud(id: string, formData: FormData) {
  await verifyAdminSession();

  const motivoRechazo = String(formData.get("motivoRechazo") ?? "").trim();
  if (!motivoRechazo) return;

  const solicitud = await prisma.certificadoSolicitud.update({
    where: { id },
    data: { estado: "RECHAZADO", motivoRechazo, revisadoEn: new Date() },
  });

  await sendMail({
    to: solicitud.email,
    subject: "Tu solicitud de certificado de matriculación fue rechazada — CPT Santa Fe",
    text: `Hola ${solicitud.nombre},\n\nTu solicitud de certificado de matriculación fue rechazada.\n\nMotivo: ${motivoRechazo}\n\nAnte cualquier consulta, contactate con la secretaría del Colegio.\n\nSaludos,\nCPT Santa Fe`,
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}/${id}?ok=1`);
}
