import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingActions } from "@/components/floating-actions";
import { ChatWidget } from "@/components/chat-widget";
import { getSedes, getContactEmails, getSiteSettings, getLinksInteres } from "@/lib/site-info";
import { getSession } from "@/lib/session";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sedes, emails, settings, session, linksInteres] = await Promise.all([
    getSedes(),
    getContactEmails(),
    getSiteSettings(),
    getSession(),
    getLinksInteres(),
  ]);
  const headerSedes = sedes.filter((s) => s.mostrarEnHeader).slice(0, 2);

  return (
    <>
      <SiteHeader
        sedes={headerSedes}
        instagramUrl={settings.instagramUrl}
        isAdmin={Boolean(session?.adminId)}
        linksInteres={linksInteres}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter sedes={sedes} emails={emails} />
      <div className="h-16 sm:hidden" aria-hidden="true" />
      <FloatingActions />
      <ChatWidget />
    </>
  );
}
