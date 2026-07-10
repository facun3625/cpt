"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-dal";

const PATH = "/admin/marketing/suscriptores";

export async function deleteSuscriptor(id: string) {
  await verifyAdminSession();
  await prisma.suscriptor.delete({ where: { id } });

  revalidatePath("/", "layout");
  redirect(`${PATH}?ok=1`);
}
