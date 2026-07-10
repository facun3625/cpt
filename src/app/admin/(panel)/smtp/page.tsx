import { getSmtpSettings } from "@/lib/site-info";
import { updateSmtpSettings } from "./actions";
import { SmtpTestForm } from "@/components/admin/smtp-test-form";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

export default async function SmtpAdminPage() {
  const settings = await getSmtpSettings();
  const isConfigured = Boolean(settings.host && settings.user && settings.password);

  return (
    <div className="max-w-2xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Configuración de email (SMTP)</h1>
      <p className="mt-1 text-sm text-ink-600">
        Datos del servidor SMTP usado para enviar correos desde el sitio (newsletter, notificaciones, etc.).
      </p>

      <div
        className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
          isConfigured ? "bg-emerald-50 text-emerald-700" : "bg-surface text-ink-500"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
          {isConfigured ? (
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          )}
        </svg>
        {isConfigured
          ? `Hay una configuración guardada (${settings.host}:${settings.port}).`
          : "Todavía no hay una configuración guardada."}
      </div>

      <form action={updateSmtpSettings} className="mt-4 space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-ink-500">Host</label>
            <input name="host" defaultValue={settings.host ?? ""} placeholder="smtp.gmail.com" required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Puerto</label>
            <input name="port" type="number" defaultValue={settings.port} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" name="secure" defaultChecked={settings.secure} className="h-4 w-4 rounded border-surface-border" />
            Usar conexión segura (SSL/TLS)
          </label>
          <p className="mt-1 pl-6 text-xs text-ink-400">
            Puerto 465 → tildar esta opción. Puerto 587 o 25 → dejarla destildada (usan STARTTLS).
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Usuario</label>
            <input name="user" defaultValue={settings.user ?? ""} placeholder="usuario@gmail.com" required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder={settings.password ? "•••••••• (dejar en blanco para mantener)" : "Contraseña"}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-ink-400">
              {settings.password ? "Ya hay una contraseña guardada." : "Todavía no hay contraseña guardada."}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">Email remitente (opcional)</label>
            <input
              name="fromEmail"
              type="email"
              defaultValue={settings.fromEmail ?? ""}
              placeholder="no-reply@cptsantafe.org"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Nombre remitente (opcional)</label>
            <input name="fromName" defaultValue={settings.fromName ?? ""} placeholder="CPT Santa Fe" className={inputClass} />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Guardar
        </button>
      </form>

      <div className="mt-6">
        <SmtpTestForm />
      </div>
    </div>
  );
}
