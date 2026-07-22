export type AdminNavColor = "primary" | "accent" | "emerald" | "amber" | "sky" | "violet" | "rose" | "teal";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  color?: AdminNavColor;
};

export const adminNav: AdminNavItem[] = [
  {
    label: "Inicio",
    href: "/admin/dashboard",
    icon: "M4 12 12 4l8 8M6 10v10h12V10",
  },
  {
    label: "Sedes y Contacto",
    href: "/admin/sedes-contacto",
    icon: "M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    color: "sky",
  },
  {
    label: "Valor del m²",
    href: "/admin/valor-m2",
    icon: "M4 20V10l8-6 8 6v10M4 20h16M4 20v-6h4v6M14 14h4v6",
    color: "primary",
  },
  {
    label: "Aranceles",
    href: "/admin/aranceles",
    icon: "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7ZM4 12h16",
    color: "amber",
  },
  {
    label: "Noticias",
    href: "/admin/noticias",
    icon: "M4 6h16v12H4V6Zm0 0 8 7 8-7M4 6h16",
    color: "rose",
  },
  {
    label: "Capacitaciones",
    href: "/admin/capacitaciones",
    icon: "M12 14l9-5-9-5-9 5 9 5Zm0 0v7m-9-5.5V17l9 5 9-5v-1.5",
    color: "violet",
  },
  {
    label: "Repositorio",
    href: "/admin/repositorio",
    icon: "M5 4h11a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V4Zm0 0a2 2 0 0 0-2 2v10M8 8h6M8 12h6M8 16h3",
    color: "teal",
  },
  {
    label: "Matriculados",
    href: "/admin/matriculados",
    icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-8 9c-3.3 0-6 1.6-6 4v1h12v-1c0-2.4-2.7-4-6-4Zm10-3.5c1.7.3 3 1.6 3 3.5v1h-3",
    color: "primary",
  },
  {
    label: "Certificados",
    href: "/admin/certificados",
    icon: "M12 3 4 6.5V11c0 4.5 3.2 7.9 8 9 4.8-1.1 8-4.5 8-9V6.5L12 3Zm-2.5 8 1.8 1.8L15.5 9.5",
    color: "emerald",
  },
  {
    label: "Bolsa de Trabajo",
    href: "/admin/bolsa-de-trabajo",
    icon: "M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Zm3 0V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M4 12h16",
    color: "amber",
  },
  {
    label: "Credenciales",
    href: "/admin/credenciales",
    icon: "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm3 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-3 8c.3-1.7 1.8-3 3.5-3h1c1.7 0 3.2 1.3 3.5 3M15 9h4M15 12h4",
    color: "sky",
  },
  {
    label: "Firmas de autoridades",
    href: "/admin/firmas",
    icon: "M3 17s2-1 4-1 3 1.5 5 1.5 3-1.5 5-1.5 4 1 4 1M4 13l6-6 3 3-6 6H4v-3Z",
    color: "violet",
  },
  {
    label: "Links de interés",
    href: "/admin/links-interes",
    icon: "M9 12a3 3 0 0 0 4.5 2.6L17 11.1a3 3 0 1 0-4.2-4.2l-1.3 1.3M15 12a3 3 0 0 0-4.5-2.6L7 12.9a3 3 0 1 0 4.2 4.2l1.3-1.3",
    color: "sky",
  },
  {
    label: "Email Marketing",
    href: "/admin/marketing",
    icon: "M4 6h16v12H4V6Zm0 0 8 7 8-7M8 15l-4 3m16-3 4 3",
    color: "rose",
  },
  {
    label: "Email (SMTP)",
    href: "/admin/smtp",
    icon: "M4 6h16v12H4V6Zm0 0 8 7 8-7",
    color: "teal",
  },
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 9c0-2.8 2.7-5 6-5s6 2.2 6 5M17 11a3 3 0 1 0 0-6M20 20c0-2.3-1.8-4.2-4-4.8",
    color: "violet",
  },
];
