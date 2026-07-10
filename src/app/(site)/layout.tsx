import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingActions } from "@/components/floating-actions";
import { ChatWidget } from "@/components/chat-widget";
import { getSedes, getContactEmails, getSiteSettings } from "@/lib/site-info";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sedes, emails, settings] = await Promise.all([getSedes(), getContactEmails(), getSiteSettings()]);
  const headerSedes = sedes.filter((s) => s.mostrarEnHeader).slice(0, 2);

  return (
    <>
      <SiteHeader sedes={headerSedes} instagramUrl={settings.instagramUrl} />
      <main className="flex-1">{children}</main>
      <SiteFooter sedes={sedes} emails={emails} />
      <FloatingActions />
      <ChatWidget />
    </>
  );
}
