"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gestoUrl, mainNav } from "@/lib/nav";
import type { Sede } from "@/generated/prisma/client";

export function SiteHeader({ sedes, instagramUrl }: { sedes: Sede[]; instagramUrl: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setHeight = () => {
      document.documentElement.style.setProperty("--site-header-h", `${el.offsetHeight}px`);
    };

    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-900 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div
        className={`hidden overflow-hidden border-b border-white/10 bg-primary-900 transition-[max-height,opacity] duration-300 lg:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
          <a
            href={gestoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-white transition-colors hover:text-white/80"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 5h6M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3M9 12h6M9 16h6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Acceso Gesto
          </a>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-white transition-colors hover:text-white/80"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16v12H4V6Zm0 0 8 7 8-7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Contacto
          </a>
          </div>
          <div className="flex items-center gap-6">
          {sedes.map((sede) => (
            <a
              key={sede.id}
              href={`tel:${sede.telefono.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-1.5 text-xs text-white/75 transition-colors hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium text-white">{sede.nombre}:</span> {sede.telefono}
            </a>
          ))}
          {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center text-white/75 transition-colors hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
          </a>
          )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="CPT Santa Fe" width={130} height={60} priority className="h-14 w-auto rounded" />
        </Link>
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-white"
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`mx-auto hidden max-w-7xl flex-col items-center px-4 text-center transition-[padding] duration-300 sm:px-6 lg:flex lg:px-8 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <span
          className={`max-w-3xl overflow-hidden text-xs font-semibold uppercase leading-snug tracking-wide text-white transition-[max-height,opacity,margin] duration-300 sm:text-sm ${
            scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
          }`}
        >
          Colegio Profesional de Maestros Mayores de Obras y Técnicos de la Arquitectura, Industria e Ingeniería de la
          Provincia de Santa Fe
        </span>

        <nav className={`flex items-center transition-[margin] duration-300 ${scrolled ? "mt-0" : "mt-4"}`}>
          <Link href="/" className="mr-10 flex items-center">
            <Image
              src="/logo.png"
              alt="CPT Santa Fe"
              width={130}
              height={60}
              priority
              className={`w-auto rounded transition-[height] duration-300 ${scrolled ? "h-10" : "h-14"}`}
            />
          </Link>
          {mainNav.map((item, index) => (
            <div
              key={item.label}
              className="relative flex items-center"
              onMouseEnter={() => item.children && setOpenSubmenu(item.label)}
              onMouseLeave={() => item.children && setOpenSubmenu(null)}
            >
              {index > 0 && <span className="h-4 w-px bg-white/20" aria-hidden="true" />}
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1 whitespace-nowrap px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                {item.label}
                {item.children && (
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>

              {item.children && (
                <div
                  className={`absolute left-1/2 top-full w-56 -translate-x-1/2 rounded-lg border border-surface-border bg-white py-2 text-left shadow-lg transition-all duration-500 ease-out ${
                    openSubmenu === item.label
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-3 opacity-0"
                  }`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-ink-600 hover:bg-primary-50 hover:text-primary-700"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <nav
          className="fixed inset-x-0 bottom-0 overflow-y-auto border-t border-white/10 bg-ink-900 px-4 py-3 lg:hidden"
          style={{ top: "var(--site-header-h, 76px)" }}
        >
          {mainNav.map((item) => (
            <div key={item.label} className="border-b border-white/10 py-1 last:border-0">
              {item.children ? (
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2 text-sm font-medium text-white"
                  onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                  aria-expanded={openSubmenu === item.label}
                >
                  {item.label}
                  <svg
                    width="12"
                    height="7"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${openSubmenu === item.label ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="block py-2 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
              {item.children && (
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: openSubmenu === item.label ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col pb-2 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="py-1.5 text-sm text-white/70"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
    <script
      dangerouslySetInnerHTML={{
        __html:
          "(function(){var h=document.currentScript.previousElementSibling;if(h){document.documentElement.style.setProperty('--site-header-h',h.offsetHeight+'px');}})();",
      }}
    />
    </>
  );
}
