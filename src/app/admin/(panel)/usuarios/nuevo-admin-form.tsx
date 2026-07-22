"use client";

import { useActionState } from "react";
import { crearAdmin } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

export function NuevoAdminForm() {
  const [state, formAction, pending] = useActionState(crearAdmin, undefined);

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-surface-border bg-surface p-4">
      <div className="min-w-[220px] flex-1">
        <label className="text-xs font-medium text-ink-500">Email</label>
        <input name="email" type="email" required className={inputClass} placeholder="nuevo@cptsantafe.org" />
      </div>
      <div className="min-w-[200px] flex-1">
        <label className="text-xs font-medium text-ink-500">Contraseña</label>
        <input name="password" type="password" required minLength={8} className={inputClass} placeholder="Mínimo 8 caracteres" />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear usuario"}
      </button>
      {state?.error && <p className="w-full text-sm font-medium text-accent-600">{state.error}</p>}
    </form>
  );
}
