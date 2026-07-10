"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/valor-m2";

export async function createEntry(formData: FormData) {
  await verifyAdminSession();
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const valor = Number(valorRaw);
  const vigenteDesdeRaw = String(formData.get("vigenteDesde") ?? "").trim();
  if (!valorRaw || Number.isNaN(valor) || valor <= 0 || !vigenteDesdeRaw) return;

  await prisma.valorM2Entry.create({
    data: { valor, vigenteDesde: new Date(`${vigenteDesdeRaw}T00:00:00Z`) },
  });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateEntry(id: string, formData: FormData) {
  await verifyAdminSession();
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const valor = Number(valorRaw);
  const vigenteDesdeRaw = String(formData.get("vigenteDesde") ?? "").trim();
  if (!valorRaw || Number.isNaN(valor) || valor <= 0 || !vigenteDesdeRaw) return;

  await prisma.valorM2Entry.update({
    where: { id },
    data: { valor, vigenteDesde: new Date(`${vigenteDesdeRaw}T00:00:00Z`) },
  });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteEntry(id: string) {
  await verifyAdminSession();
  await prisma.valorM2Entry.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
