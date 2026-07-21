"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";
import { logout } from "@/app/admin/actions";

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-white/10 bg-ink-900">
      <div className="flex items-center gap-2 px-6 py-4">
        <span className="text-lg font-bold tracking-wide text-white">CPT</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
          Panel
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-1">
        {adminNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                active ? "bg-primary-700 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                <path d={item.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 py-2.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path
              d="M15 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9m-4-4-4-4m0 0 4-4m-4 4h11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver al sitio
        </Link>

        <div className="mt-1.5 flex items-center gap-2.5 rounded-lg px-3 py-1.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-700 text-[11px] font-semibold text-white">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <p className="truncate text-xs text-white/70">{email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-accent-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
              <path
                d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3m5-4 4-4m0 0-4-4m4 4H9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
