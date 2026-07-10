"use client";

import { useActionState } from "react";
import { suscribirNewsletter, type SuscribirState } from "@/app/(site)/newsletter-actions";

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState<SuscribirState, FormData>(suscribirNewsletter, undefined);

  if (state?.ok) {
    return (
      <p className="mx-auto mt-8 max-w-md rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white">
        ¡Listo! Ya estás suscripto a nuestras novedades.
      </p>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-md">
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Suscribirme"}
        </button>
      </form>
      {state?.error && <p className="mt-3 text-sm font-medium text-accent-300">{state.error}</p>}
    </div>
  );
}
