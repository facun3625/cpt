"use server";

import { prisma } from "@/lib/prisma";
import { getMatriculadoByMatricula } from "@/lib/site-info";

export type VerificarResult = { ok: true; nombre: string; apellido: string } | { ok: false; error: string };

export async function verificarMatricula(numeroMatricula: string): Promise<VerificarResult> {
  const matriculado = await getMatriculadoByMatricula(numeroMatricula.trim());
  if (!matriculado) {
    return { ok: false, error: "No encontramos una matrícula habilitada con ese número. Verificá el dato ingresado." };
  }
  return { ok: true, nombre: matriculado.nombre, apellido: matriculado.apellido };
}

export type RegistroResult = { ok: true } | { ok: false; error: string };

export async function crearRegistroTecnico(formData: FormData): Promise<RegistroResult> {
  const numeroMatricula = String(formData.get("numeroMatricula") ?? "").trim();
  const especialidadId = String(formData.get("especialidadId") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const localidad = String(formData.get("localidad") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const disponibilidad = String(formData.get("disponibilidad") ?? "").trim() || null;
  const observaciones = String(formData.get("observaciones") ?? "").trim() || null;
  const mostrarTelefono = formData.get("mostrarTelefono") === "on";
  const mostrarEmail = formData.get("mostrarEmail") === "on";

  if (!numeroMatricula || !especialidadId || !nombre || !telefono || !email || !localidad || !descripcion) {
    return { ok: false, error: "Completá todos los campos requeridos." };
  }

  const matriculado = await getMatriculadoByMatricula(numeroMatricula);
  if (!matriculado) {
    return { ok: false, error: "No pudimos verificar tu matrícula. Volvé a intentar la verificación." };
  }

  await prisma.tecnicoBolsa.create({
    data: {
      numeroMatricula: matriculado.numeroMatricula,
      especialidadId,
      nombre,
      telefono,
      email,
      localidad,
      descripcion,
      disponibilidad,
      observaciones,
      mostrarTelefono,
      mostrarEmail,
    },
  });

  return { ok: true };
}
