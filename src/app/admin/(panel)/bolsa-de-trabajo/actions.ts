"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/bolsa-de-trabajo";

export async function toggleActivo(id: string, activo: boolean) {
  await verifyAdminSession();
  await prisma.tecnicoBolsa.update({ where: { id }, data: { activo: !activo } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function toggleDestacado(id: string, destacado: boolean) {
  await verifyAdminSession();
  await prisma.tecnicoBolsa.update({ where: { id }, data: { destacado: !destacado } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteTecnico(id: string) {
  await verifyAdminSession();
  await prisma.tecnicoBolsa.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateTecnico(id: string, formData: FormData) {
  await verifyAdminSession();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const localidad = String(formData.get("localidad") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const disponibilidad = String(formData.get("disponibilidad") ?? "").trim() || null;
  const observaciones = String(formData.get("observaciones") ?? "").trim() || null;
  const especialidadId = String(formData.get("especialidadId") ?? "").trim();
  const mostrarTelefono = formData.get("mostrarTelefono") === "on";
  const mostrarEmail = formData.get("mostrarEmail") === "on";

  if (!nombre || !telefono || !email || !localidad || !descripcion || !especialidadId) return;

  await prisma.tecnicoBolsa.update({
    where: { id },
    data: {
      nombre,
      telefono,
      email,
      localidad,
      descripcion,
      disponibilidad,
      observaciones,
      especialidadId,
      mostrarTelefono,
      mostrarEmail,
    },
  });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
