"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { parseMatriculadosFile } from "@/lib/csv";
import { logActivity } from "@/lib/activity-log";

const PATH = "/admin/matriculados";
const EXTENSIONES_SOPORTADAS = [".csv", ".xlsx", ".xls", ".xml"];

export type UploadState = { error?: string } | undefined;

export async function uploadMatriculados(_prevState: UploadState, formData: FormData): Promise<UploadState> {
  const session = await verifyAdminSession();

  const file = formData.get("archivo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Seleccioná un archivo." };
  }
  const nombreLower = file.name.toLowerCase();
  if (!EXTENSIONES_SOPORTADAS.some((ext) => nombreLower.endsWith(ext))) {
    return { error: "El archivo debe ser CSV, XLS o XLSX." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { rows, errores } = parseMatriculadosFile(buffer, file.name);

  if (rows.length === 0) {
    return { error: errores[0] ?? "No se encontraron filas válidas en el archivo." };
  }

  const numerosMatricula = rows.map((r) => r.numeroMatricula);

  // Fechas de matriculación ya registradas: sobreviven aunque la matrícula
  // desaparezca de un CSV (p. ej. suspensión) y reaparezca en una carga posterior.
  const registrosFecha = await prisma.matriculaFechaRegistro.findMany({
    where: { numeroMatricula: { in: numerosMatricula } },
  });
  const fechaPorMatricula = new Map(registrosFecha.map((r) => [r.numeroMatricula, r.fechaMatriculacion]));

  await prisma.$transaction([
    // Elimina a quienes ya no figuran en el archivo nuevo
    prisma.matriculadoHabilitado.deleteMany({ where: { numeroMatricula: { notIn: numerosMatricula } } }),
    // Upsert por número de matrícula: repone fechaMatriculacion desde el registro paralelo si existe
    ...rows.map((row) => {
      const fechaGuardada = fechaPorMatricula.get(row.numeroMatricula);
      const camposOpcionales = {
        email: row.email || null,
        condicion: row.condicion || null,
        titulo: row.titulo || null,
        situacion: row.situacion || null,
        domicilioLaboral: row.domicilioLaboral || null,
        codigoPostal: row.codigoPostal || null,
        idLocalidad: row.idLocalidad || null,
      };
      return prisma.matriculadoHabilitado.upsert({
        where: { numeroMatricula: row.numeroMatricula },
        update: {
          numeroDocumento: row.numeroDocumento,
          nombre: row.nombre,
          apellido: row.apellido,
          ...camposOpcionales,
          ...(fechaGuardada ? { fechaMatriculacion: fechaGuardada } : {}),
        },
        create: {
          numeroDocumento: row.numeroDocumento,
          nombre: row.nombre,
          apellido: row.apellido,
          numeroMatricula: row.numeroMatricula,
          ...camposOpcionales,
          fechaMatriculacion: fechaGuardada ?? null,
        },
      });
    }),
    prisma.matriculadosUpload.upsert({
      where: { id: "matriculados" },
      update: { uploadedAt: new Date(), cantidad: rows.length, nombreArchivo: file.name },
      create: { id: "matriculados", uploadedAt: new Date(), cantidad: rows.length, nombreArchivo: file.name },
    }),
  ]);

  await logActivity(session.email, "Subió una lista de matriculados (CSV)", `${rows.length} matriculados — ${file.name}`);

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateFechaMatriculacion(id: string, formData: FormData) {
  await verifyAdminSession();
  const raw = String(formData.get("fechaMatriculacion") ?? "").trim();

  const matriculado = await prisma.matriculadoHabilitado.update({
    where: { id },
    data: { fechaMatriculacion: raw ? new Date(`${raw}T00:00:00Z`) : null },
  });

  if (matriculado.fechaMatriculacion) {
    await prisma.matriculaFechaRegistro.upsert({
      where: { numeroMatricula: matriculado.numeroMatricula },
      update: { fechaMatriculacion: matriculado.fechaMatriculacion },
      create: { numeroMatricula: matriculado.numeroMatricula, fechaMatriculacion: matriculado.fechaMatriculacion },
    });
  } else {
    await prisma.matriculaFechaRegistro.deleteMany({ where: { numeroMatricula: matriculado.numeroMatricula } });
  }

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
