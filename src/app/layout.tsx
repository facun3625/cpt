import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  openGraph: { siteName: "CPT Santa Fe", locale: "es_AR", type: "website" },
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
