import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminNav, type AdminNavColor } from "@/lib/admin-nav";

const COLOR_STYLES: Record<AdminNavColor, { bg: string; text: string }> = {
  primary: { bg: "bg-primary-50", text: "text-primary-700" },
  accent: { bg: "bg-accent-500/10", text: "text-accent-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
  sky: { bg: "bg-sky-50", text: "text-sky-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700" },
  rose: { bg: "bg-rose-50", text: "text-rose-700" },
  teal: { bg: "bg-teal-50", text: "text-teal-700" },
};

async function getStats() {
  const [matriculados, certPendientes, credPendientes, tecnicosActivos, suscriptores] = await Promise.all([
    prisma.matriculadoHabilitado.count(),
    prisma.certificadoSolicitud.count({ where: { estado: "PENDIENTE" } }),
    prisma.credencialSolicitud.count({ where: { estado: "PENDIENTE" } }),
    prisma.tecnicoBolsa.count({ where: { activo: true } }),
    prisma.suscriptor.count(),
  ]);

  return {
    matriculados,
    pendientes: certPendientes + credPendientes,
    tecnicosActivos,
    suscriptores,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards: {
    label: string;
    value: number;
    href: string;
    color: AdminNavColor;
    icon: string;
  }[] = [
    {
      label: "Matriculados habilitados",
      value: stats.matriculados,
      href: "/admin/matriculados",
      color: "primary",
      icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-8 9c-3.3 0-6 1.6-6 4v1h12v-1c0-2.4-2.7-4-6-4Zm10-3.5c1.7.3 3 1.6 3 3.5v1h-3",
    },
    {
      label: "Solicitudes pendientes",
      value: stats.pendientes,
      href: "/admin/certificados",
      color: "accent",
      icon: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0Z",
    },
    {
      label: "Técnicos activos en Bolsa de Trabajo",
      value: stats.tecnicosActivos,
      href: "/admin/bolsa-de-trabajo",
      color: "amber",
      icon: "M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Zm3 0V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M4 12h16",
    },
    {
      label: "Suscriptores al newsletter",
      value: stats.suscriptores,
      href: "/admin/marketing",
      color: "rose",
      icon: "M4 6h16v12H4V6Zm0 0 8 7 8-7M8 15l-4 3m16-3 4 3",
    },
  ];

  const modulos = adminNav.filter((item) => item.href !== "/admin/dashboard");

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Inicio</h1>
      <p className="mt-1 text-sm text-ink-600">Panel de administración del sitio de CPT Santa Fe.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const style = COLOR_STYLES[stat.color];
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex items-start gap-4 rounded-xl border border-surface-border bg-white p-5 transition-colors hover:border-primary-400"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d={stat.icon} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-2xl font-semibold text-ink-900">{stat.value}</p>
                <p className="mt-0.5 text-xs text-ink-500">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink-400">Secciones del panel</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map((mod) => {
          const style = COLOR_STYLES[mod.color ?? "primary"];
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex items-center gap-4 rounded-xl border border-surface-border bg-white p-5 transition-colors hover:border-primary-400"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d={mod.icon} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-ink-900 group-hover:text-primary-700">{mod.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
