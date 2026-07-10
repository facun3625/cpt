"use client";

import { useActionState } from "react";
import { sendTestEmail, type TestEmailState } from "@/app/admin/(panel)/smtp/actions";

export function SmtpTestForm() {
  const [state, formAction, pending] = useActionState<TestEmailState, FormData>(sendTestEmail, undefined);

  return (
    <div className="rounded-xl border border-surface-border bg-white p-6">
      <h2 className="text-sm font-semibold text-ink-900">Enviar email de prueba</h2>
      <p className="mt-1 text-sm text-ink-600">Probá la configuración guardada enviando un correo de prueba.</p>

      <form action={formAction} className="mt-4 flex flex-wrap items-center gap-3">
        <input
          name="testTo"
          type="email"
          required
          placeholder="destino@email.com"
          className="min-w-[240px] flex-1 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar prueba"}
        </button>
      </form>

      {state?.success && <p className="mt-3 text-sm font-medium text-emerald-600">{state.success}</p>}
      {state?.error && <p className="mt-3 text-sm font-medium text-accent-600">{state.error}</p>}
    </div>
  );
}
