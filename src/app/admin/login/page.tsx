"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { login } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-[45%] lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Image src="/logo.png" alt="CPT Santa Fe" width={130} height={60} unoptimized className="h-14 w-auto" />

          <h1 className="mt-8 text-2xl font-semibold text-ink-900">Panel de administración</h1>
          <p className="mt-1 text-sm text-ink-600">Ingresá con tu cuenta de administrador.</p>

          <form action={formAction} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink-700">
                Email
              </label>
              <div className="relative mt-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M5 20c1-3.3 4-5 7-5s6 1.7 7 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-surface-border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-ink-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                  aria-hidden="true"
                >
                  <rect x="5" y="10.5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-surface-border py-2.5 pl-10 pr-10 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-600"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M6.5 6.7C4.5 8.1 3 10 2 12c1.8 3.6 5.5 7 10 7 1.6 0 3.1-.4 4.4-1.1M9.9 4.2A10.4 10.4 0 0 1 12 4c4.5 0 8.2 3.4 10 7-.6 1.2-1.4 2.4-2.3 3.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M2 12c1.8-3.6 5.5-7 10-7s8.2 3.4 10 7c-1.8 3.6-5.5 7-10 7s-8.2-3.4-10-7Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {state?.error && <p className="text-sm font-medium text-accent-600">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-60"
            >
              {pending ? (
                "Ingresando…"
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 17l5-5-5-5M4 12h11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Ingresar
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block lg:w-[55%]">
        <Image src="/hero-construction.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-primary-700/80" />

        <div className="relative flex h-full flex-col justify-center px-16 xl:px-20">
          <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
            Panel institucional
          </span>
          <h2 className="mt-6 max-w-md text-3xl font-semibold text-white xl:text-4xl">
            Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/75">
            Gestioná matriculados, certificados, credenciales digitales y contenidos del sitio desde un solo lugar.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-300 backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3 4 6.5V11c0 4.5 3.2 7.9 8 9 4.8-1.1 8-4.5 8-9V6.5L12 3Zm-2.5 8 1.8 1.8L15.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/20 text-sky-300 backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm3 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-3 8c.3-1.7 1.8-3 3.5-3h1c1.7 0 3.2 1.3 3.5 3M15 9h4M15 12h4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-8 9c-3.3 0-6 1.6-6 4v1h12v-1c0-2.4-2.7-4-6-4Zm10-3.5c1.7.3 3 1.6 3 3.5v1h-3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
