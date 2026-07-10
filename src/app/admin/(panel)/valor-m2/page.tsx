import { getValorM2Entries, getValorM2Status } from "@/lib/site-info";
import { formatCurrency, formatDate } from "@/lib/format";
import { createEntry, updateEntry, deleteEntry } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function ValorM2AdminPage() {
  const [entries, status] = await Promise.all([getValorM2Entries(), getValorM2Status()]);
  const sorted = [...entries].sort((a, b) => b.vigenteDesde.getTime() - a.vigenteDesde.getTime());

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Valor del m²</h1>
      <p className="mt-1 text-sm text-ink-600">
        Cargá los valores con la fecha desde la que rigen. El sitio muestra automáticamente cuál está vigente
        según la fecha de hoy, y arma el historial con los anteriores.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-primary-900/10 bg-primary-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Vigente ahora</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {status.current ? formatCurrency(status.current.valor) : "—"}
          </p>
          {status.current && (
            <p className="mt-1 text-xs text-white/60">Desde el {formatDate(status.current.vigenteDesde)}</p>
          )}
        </div>
        <div className="rounded-xl border border-dashed border-surface-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Próximo valor</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">
            {status.next ? formatCurrency(status.next.valor) : "Sin definir"}
          </p>
          {status.next && (
            <p className="mt-1 text-xs text-ink-400">Entra en vigencia el {formatDate(status.next.vigenteDesde)}</p>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink-400">Todos los valores</h2>
      <div className="mt-4 space-y-3">
        {sorted.map((entry) => {
          const isCurrent = entry.id === status.current?.id;
          const isNext = entry.id === status.next?.id;
          return (
            <form
              key={entry.id}
              action={updateEntry.bind(null, entry.id)}
              className="flex flex-wrap items-end gap-3 rounded-xl border border-surface-border bg-white p-5"
            >
              <div className="w-40">
                <label className="text-xs font-medium text-ink-500">Valor ($)</label>
                <input name="valor" type="number" min="1" defaultValue={entry.valor} required className={inputClass} />
              </div>
              <div className="w-44">
                <label className="text-xs font-medium text-ink-500">Vigente desde</label>
                <input
                  name="vigenteDesde"
                  type="date"
                  defaultValue={toDateInputValue(entry.vigenteDesde)}
                  required
                  className={inputClass}
                />
              </div>
              {isCurrent && (
                <span className="mb-2.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Vigente
                </span>
              )}
              {isNext && (
                <span className="mb-2.5 rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-600">
                  Próximo
                </span>
              )}
              <button
                type="submit"
                className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
              >
                Guardar
              </button>
              <button
                type="submit"
                formAction={deleteEntry.bind(null, entry.id)}
                className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
              >
                Eliminar
              </button>
            </form>
          );
        })}

        <form action={createEntry} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-surface-border bg-surface p-5">
          <div className="w-40">
            <label className="text-xs font-medium text-ink-500">Valor ($)</label>
            <input name="valor" type="number" min="1" required className={inputClass} />
          </div>
          <div className="w-44">
            <label className="text-xs font-medium text-ink-500">Vigente desde</label>
            <input name="vigenteDesde" type="date" required className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Agregar valor
          </button>
        </form>
      </div>
    </div>
  );
}
