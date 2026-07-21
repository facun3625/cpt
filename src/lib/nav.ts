export const gestoUrl = "https://www.gesto.org.ar/cptsantafe/prof/login.php";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: { label: string; href: string; external?: boolean }[];
};

export const mainNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Institucional",
    href: "/institucional",
    children: [
      { label: "El CPT", href: "/institucional/cpt" },
      { label: "Directorio", href: "/institucional/directorio" },
      { label: "Distrito 1", href: "/institucional/distrito-1" },
    ],
  },
  {
    label: "Matriculación",
    href: "/matriculacion",
    children: [
      { label: "Requisitos", href: "/matriculacion/requisitos" },
      { label: "Títulos profesionales", href: "/matriculacion/titulos-profesionales" },
      { label: "Pagos por transferencia", href: "/matriculacion/pagos-transferencia" },
    ],
  },
  {
    label: "Oficina Técnica",
    href: "/oficina-tecnica",
    children: [
      { label: "Aranceles", href: "/oficina-tecnica/aranceles" },
      { label: "Escala de Honorarios", href: "/oficina-tecnica/escala-honorarios" },
    ],
  },
  {
    label: "De Interés",
    href: "/de-interes",
    children: [
      { label: "Noticias", href: "/noticias" },
      { label: "Capacitaciones", href: "/de-interes/capacitaciones" },
      { label: "Links de interés", href: "/de-interes/links" },
    ],
  },
  {
    label: "Serv. a Matriculados",
    href: "/servicios-matriculados",
    children: [
      { label: "Calculadora de m²", href: "/valor-m2" },
      { label: "Certificado de matriculación", href: "/matriculacion/certificado" },
      { label: "Credencial digital", href: "/matriculacion/credencial" },
      { label: "Repositorio de archivos", href: "/de-interes/descargas" },
      { label: "Bolsa de Trabajo", href: "/bolsa-de-trabajo" },
    ],
  },
];

export const quickAccess = [
  {
    label: "Calculadora de m²",
    description: "Consultá el valor vigente y calculá tus honorarios",
    href: "/valor-m2",
  },
  {
    label: "Trámites online",
    description: "Boletas de matrícula y gestiones sin moverte de casa",
    href: "/de-interes/pagos",
  },
  {
    label: "Bolsa de trabajo",
    description: "Ofertas laborales y técnicos disponibles",
    href: "/bolsa-de-trabajo",
  },
  {
    label: "Repositorio de archivos",
    description: "Formularios, reglamentos, circulares y manuales",
    href: "/de-interes/descargas",
  },
  {
    label: "Matriculación",
    description: "Requisitos y títulos profesionales habilitados",
    href: "/matriculacion/requisitos",
  },
  {
    label: "Noticias",
    description: "Novedades institucionales y del sector",
    href: "/noticias",
  },
  {
    label: "Certificado de matriculación",
    description: "Descargá tu certificado de matriculación vigente",
    href: "/matriculacion/certificado",
  },
  {
    label: "Credencial digital",
    description: "Accedé a tu credencial digital de matriculado",
    href: "/matriculacion/credencial",
  },
];

