"use server";

import { prisma } from "@/lib/prisma";
import { getMatriculadoByMatriculaYDocumento } from "@/lib/site-info";
import { saveUploadedFoto } from "@/lib/upload";

export type VerificarResult =
  | { ok: true; nombre: string; apellido: string; numeroMatricula: string }
  | { ok: false; error: string };

export async function verificarMatricula(numeroMatricula: string, numeroDocumento: string): Promise<VerificarResult> {
  const matriculado = await getMatriculadoByMatriculaYDocumento(numeroMatricula.trim(), numeroDocumento.trim());
  if (!matriculado) {
    return { ok: false, error: "No encontramos un matriculado habilitado con esos datos. Verificá el número de matrícula y de documento." };
  }
  return { ok: true, nombre: matriculado.nombre, apellido: matriculado.apellido, numeroMatricula: matriculado.numeroMatricula };
}

export type SolicitudResult = { ok: true } | { ok: false; error: string };

export async function crearSolicitudCredencial(formData: FormData): Promise<SolicitudResult> {
  const numeroMatricula = String(formData.get("numeroMatricula") ?? "").trim();
  const numeroDocumento = String(formData.get("numeroDocumento") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const foto = formData.get("foto");

  if (!numeroMatricula || !numeroDocumento || !email || !(foto instanceof File) || foto.size === 0) {
    return { ok: false, error: "Completá todos los campos requeridos y subí una foto." };
  }

  const matriculado = await getMatriculadoByMatriculaYDocumento(numeroMatricula, numeroDocumento);
  if (!matriculado) {
    return { ok: false, error: "No pudimos verificar tu matrícula. Volvé a intentar la verificación." };
  }

  const fotoUrl = await saveUploadedFoto(foto);
  if (!fotoUrl) {
    return { ok: false, error: "La foto debe ser una imagen JPG o PNG." };
  }

  const codigoVerificacion = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();

  await prisma.credencialSolicitud.create({
    data: {
      numeroDocumento: matriculado.numeroDocumento,
      nombre: matriculado.nombre,
      apellido: matriculado.apellido,
      numeroMatricula: matriculado.numeroMatricula,
      fechaMatriculacion: matriculado.fechaMatriculacion,
      tituloProfesional: matriculado.titulo,
      email,
      fotoUrl,
      codigoVerificacion,
    },
  });

  return { ok: true };
}
