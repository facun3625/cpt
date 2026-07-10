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

  await prisma.$transaction([
    // Elimina a quienes ya no figuran en el archivo nuevo
    prisma.matriculadoHabilitado.deleteMany({ where: { numeroMatricula: { notIn: numerosMatricula } } }),
    // Upsert por número de matrícula: preserva fechaMatriculacion cargada a mano en el panel
    ...rows.map((row) =>
      prisma.matriculadoHabilitado.upsert({
        where: { numeroMatricula: row.numeroMatricula },
        update: {
          numeroDocumento: row.numeroDocumento,
          nombre: row.nombre,
          apellido: row.apellido,
          email: row.email || null,
        },
        create: { ...row, email: row.email || null },
      }),
    ),
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

  await prisma.matriculadoHabilitado.update({
    where: { id },
    data: { fechaMatriculacion: raw ? new Date(`${raw}T00:00:00Z`) : null },
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
