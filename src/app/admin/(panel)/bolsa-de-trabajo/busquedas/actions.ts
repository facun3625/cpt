"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/bolsa-de-trabajo/busquedas";

function readCommonFields(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const empresa = String(formData.get("empresa") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const localidad = String(formData.get("localidad") ?? "").trim();
  const modalidad = String(formData.get("modalidad") ?? "PRESENCIAL").trim();
  const contacto = String(formData.get("contacto") ?? "").trim();
  const estado = String(formData.get("estado") ?? "ACTIVA").trim();
  const fechaCierreRaw = String(formData.get("fechaCierre") ?? "").trim();
  const especialidadId = String(formData.get("especialidadId") ?? "").trim() || null;

  if (!titulo || !empresa || !descripcion || !localidad || !contacto) return null;

  return {
    titulo,
    empresa,
    descripcion,
    localidad,
    modalidad: modalidad as "PRESENCIAL" | "REMOTO" | "HIBRIDO",
    contacto,
    estado: estado as "ACTIVA" | "CERRADA",
    fechaCierre: fechaCierreRaw ? new Date(`${fechaCierreRaw}T00:00:00Z`) : null,
    especialidadId,
  };
}

export async function createBusqueda(formData: FormData) {
  await verifyAdminSession();
  const data = readCommonFields(formData);
  if (!data) return;

  await prisma.busquedaLaboral.create({ data });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateBusqueda(id: string, formData: FormData) {
  await verifyAdminSession();
  const data = readCommonFields(formData);
  if (!data) return;

  await prisma.busquedaLaboral.update({ where: { id }, data });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteBusqueda(id: string) {
  await verifyAdminSession();
  await prisma.busquedaLaboral.delete({ where: { id } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
