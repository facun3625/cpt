import { Suspense } from "react";
import { verifyAdminSession } from "@/lib/admin-dal";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminToast } from "@/components/admin-toast";

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifyAdminSession();

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar email={session.email} />
      <main className="ml-64 min-h-screen">{children}</main>
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </div>
  );
}
