"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/links-interes";

function normalizeUrl(url: string) {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}

export async function createLink(formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!titulo || !url) return;

  const count = await prisma.linkInteres.count();
  await prisma.linkInteres.create({ data: { titulo, url: normalizeUrl(url), orden: count } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function updateLink(id: string, formData: FormData) {
  await verifyAdminSession();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!titulo || !url) return;

  await prisma.linkInteres.update({ where: { id }, data: { titulo, url: normalizeUrl(url) } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}

export async function deleteLink(id: string) {
  await verifyAdminSession();
  await prisma.linkInteres.delete({ where: { id } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
