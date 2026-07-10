"use client";

import Link from "next/link";
import { gestoUrl } from "@/lib/nav";

const actions = [
  {
    label: "Gesto",
    href: gestoUrl,
    external: true,
    icon: (
      <path
        d="M9 5h6M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3M9 12h6M9 16h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Calculadora de m²",
    href: "/valor-m2",
    icon: (
      <path
        d="M4 20V10l8-6 8 6v10M4 20h16M4 20v-6h4v6M14 14h4v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Credencial digital",
    href: "/matriculacion/credencial",
    icon: (
      <path
        d="M3 6h18v12H3V6Zm4 3h2m-2 3h4M14 9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-1.5 5.5c.3-1.5 1.6-2.5 3-2.5s2.7 1 3 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Certificado de matriculación",
    href: "/matriculacion/certificado",
    icon: (
      <path
        d="M12 3 4 6.5V11c0 4.5 3.2 7.9 8 9 4.8-1.1 8-4.5 8-9V6.5L12 3Zm-2.5 8 1.8 1.8L15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Contacto",
    href: "#contacto",
    icon: (
      <path
        d="M4 6h16v12H4V6Zm0 0 8 7 8-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function FloatingActions() {
  return (
    <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 sm:flex">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noopener noreferrer" : undefined}
          onClick={(e) => {
            if (action.href.startsWith("#")) {
              e.preventDefault();
              document.getElementById(action.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-l-xl bg-primary-700 text-white shadow-lg transition-colors hover:bg-accent-500"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {action.icon}
          </svg>
          <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-lg bg-primary-700 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
