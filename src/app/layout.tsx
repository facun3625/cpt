import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPT Santa Fe | Colegio Profesional de Maestros Mayores de Obras y Técnicos",
  description:
    "Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe. Matriculación, valor del m², trámites, noticias y bolsa de trabajo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full scroll-smooth antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-ink-900">{children}</body>
    </html>
  );
}
