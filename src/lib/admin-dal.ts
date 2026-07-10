import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const verifyAdminSession = cache(async () => {
  const session = await getSession();
  if (!session?.adminId) {
    redirect("/admin/login");
  }
  return session;
});
