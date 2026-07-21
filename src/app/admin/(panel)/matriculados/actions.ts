"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";
import { parseMatriculadosCsv } from "@/lib/csv";

const PATH = "/admin/matriculados";

export type UploadState = { error?: string } | undefined;

export async function uploadMatriculados(_prevState: UploadState, formData: FormData): Promise<UploadState> {
  await verifyAdminSession();

  const file = formData.get("archivo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Seleccioná un archivo CSV." };
  }
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return { error: "El archivo debe ser un CSV." };
  }

  const content = await file.text();
  const { rows, errores } = parseMatriculadosCsv(content);

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
      return prisma.matriculadoHabilitado.upsert({
        where: { numeroMatricula: row.numeroMatricula },
        update: {
          numeroDocumento: row.numeroDocumento,
          nombre: row.nombre,
          apellido: row.apellido,
          email: row.email || null,
          ...(fechaGuardada ? { fechaMatriculacion: fechaGuardada } : {}),
        },
        create: { ...row, email: row.email || null, fechaMatriculacion: fechaGuardada ?? null },
      });
    }),
    prisma.matriculadosUpload.upsert({
      where: { id: "matriculados" },
      update: { uploadedAt: new Date(), cantidad: rows.length, nombreArchivo: file.name },
      create: { id: "matriculados", uploadedAt: new Date(), cantidad: rows.length, nombreArchivo: file.name },
    }),
  ]);

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
