import { Suspense } from "react";
import { verifyAdminSession } from "@/lib/admin-dal";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminToast } from "@/components/admin-toast";
import { prisma } from "@/lib/prisma";

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifyAdminSession();

  const [certificadosPendientes, credencialesPendientes] = await Promise.all([
    prisma.certificadoSolicitud.count({ where: { estado: "PENDIENTE" } }),
    prisma.credencialSolicitud.count({ where: { estado: "PENDIENTE" } }),
  ]);

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar
        email={session.email}
        pendingCounts={{
          "/admin/certificados": certificadosPendientes,
          "/admin/credenciales": credencialesPendientes,
        }}
      />
      <main className="ml-64 min-h-screen">{children}</main>
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </div>
  );
}
