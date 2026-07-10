import { getSedes, getContactEmails, getSiteSettings } from "@/lib/site-info";
import { createSede, updateSede, deleteSede, createEmail, updateEmail, deleteEmail, updateSettings } from "./actions";
import { SedeHeaderProvider } from "@/components/sede-header-context";
import { SedeHeaderCheckbox } from "@/components/sede-header-checkbox";
import { SedeHeaderCounter } from "@/components/sede-header-counter";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

export default async function SedesContactoPage() {
  const [sedes, emails, settings] = await Promise.all([getSedes(), getContactEmails(), getSiteSettings()]);

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Sedes y Contacto</h1>
      <p className="mt-1 text-sm text-ink-600">
        Esta información se muestra en el header y el pie de página de todo el sitio.
      </p>

      <SedeHeaderProvider initialChecked={sedes.filter((s) => s.mostrarEnHeader).map((s) => s.id)}>
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Sedes</h2>
          <SedeHeaderCounter />
        </div>
        <div className="mt-4 space-y-4">
          {sedes.map((sede) => {
            const formId = `sede-form-${sede.id}`;
            return (
              <form key={sede.id} id={formId} className="rounded-xl border border-surface-border bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <label className="text-xs font-medium text-ink-500">Nombre</label>
                    <input name="nombre" defaultValue={sede.nombre} required className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink-500">Dirección</label>
                    <input name="direccion" defaultValue={sede.direccion} required className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink-500">Teléfono</label>
                    <input name="telefono" defaultValue={sede.telefono} required className={inputClass} />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      formAction={updateSede.bind(null, sede.id)}
                      className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
                    >
                      Guardar
                    </button>
                    <button
                      type="submit"
                      formAction={deleteSede.bind(null, sede.id)}
                      className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <SedeHeaderCheckbox sedeId={sede.id} formId={formId} />
              </form>
            );
          })}

          <form action={createSede} className="rounded-xl border border-dashed border-surface-border bg-surface p-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="text-xs font-medium text-ink-500">Nombre</label>
                <input name="nombre" placeholder="Ej: Reconquista" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Dirección</label>
                <input name="direccion" placeholder="Calle 123" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">Teléfono</label>
                <input name="telefono" placeholder="(+54 ...) ..." required className={inputClass} />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Agregar sede
                </button>
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" name="mostrarEnHeader" className="h-4 w-4 rounded border-surface-border" />
              Mostrar teléfono en el header (máx. 2)
            </label>
          </form>
        </div>
      </SedeHeaderProvider>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-ink-400">Emails de contacto</h2>
      <div className="mt-4 space-y-4">
        {emails.map((email) => (
          <form key={email.id} className="grid gap-3 rounded-xl border border-surface-border bg-white p-5 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-ink-500">Etiqueta</label>
              <input name="label" defaultValue={email.label} required className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-500">Email</label>
              <input name="value" type="email" defaultValue={email.value} required className={inputClass} />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                formAction={updateEmail.bind(null, email.id)}
                className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
              >
                Guardar
              </button>
              <button
                type="submit"
                formAction={deleteEmail.bind(null, email.id)}
                className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
              >
                Eliminar
              </button>
            </div>
          </form>
        ))}

        <form action={createEmail} className="grid gap-3 rounded-xl border border-dashed border-surface-border bg-surface p-5 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-ink-500">Etiqueta</label>
            <input name="label" placeholder="Ej: Mesa de entradas" required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Email</label>
            <input name="value" type="email" placeholder="area@cptsantafe.org" required className={inputClass} />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Agregar email
            </button>
          </div>
        </form>
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-ink-400">Redes sociales</h2>
      <form action={updateSettings} className="mt-4 grid gap-3 rounded-xl border border-surface-border bg-white p-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-ink-500">Link de Instagram</label>
          <input
            name="instagramUrl"
            type="url"
            placeholder="https://instagram.com/cptsantafe"
            defaultValue={settings.instagramUrl ?? ""}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
