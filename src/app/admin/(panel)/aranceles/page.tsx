import Link from "next/link";
import { getArancelesInfo, getArancelGrupos, getValorM2Status } from "@/lib/site-info";
import { formatCurrency } from "@/lib/format";
import {
  updateInfo,
  createGrupo,
  updateGrupo,
  deleteGrupo,
  createItem,
  updateItem,
  deleteItem,
} from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

const ADICIONAL_LEY_4889_PCT = 0.1;

export default async function ArancelesAdminPage() {
  const [info, grupos, valorM2Status] = await Promise.all([
    getArancelesInfo(),
    getArancelGrupos(),
    getValorM2Status(),
  ]);
  const numeroBase = valorM2Status.current?.valor ?? 0;
  const gruposComunes = grupos.filter((g) => !g.esHonorarioMinimo);
  const honorarioMinimo = grupos.find((g) => g.esHonorarioMinimo);

  const subtotal = honorarioMinimo?.items.reduce((sum, item) => sum + item.valor, 0) ?? 0;
  const adicional = Math.round(subtotal * ADICIONAL_LEY_4889_PCT);
  const total = subtotal + adicional;

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Aranceles de Oficina Técnica</h1>
      <p className="mt-1 text-sm text-ink-600">
        Se muestra en la página pública de Aranceles. El honorario mínimo se calcula solo (subtotal + 10% Ley 4889).
      </p>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink-400">Información general</h2>
      <form action={updateInfo} className="mt-4 grid gap-4 rounded-xl border border-surface-border bg-white p-5 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-ink-500">Vigente desde</label>
          <input name="vigenciaFecha" placeholder="Ej: 25/03/2026" defaultValue={info.vigenciaFecha} required className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Número base de tareas concurrentes</label>
          <p className="mt-1 rounded-lg bg-surface px-3 py-2 text-sm text-ink-600">{formatCurrency(numeroBase)}</p>
          <p className="mt-1 text-xs text-ink-400">
            Se toma automáticamente del{" "}
            <Link href="/admin/valor-m2" className="font-semibold text-primary-700 hover:text-primary-900">
              valor del m² vigente
            </Link>
            .
          </p>
        </div>
        <div className="flex items-end">
          <button type="submit" className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900">
            Guardar
          </button>
        </div>
      </form>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-ink-400">Grupos de aranceles</h2>
      <div className="mt-4 space-y-6">
        {gruposComunes.map((grupo) => (
          <div key={grupo.id} className="rounded-xl border border-surface-border bg-white p-5">
            <form action={updateGrupo.bind(null, grupo.id)} className="flex flex-wrap items-end gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-ink-500">Título del grupo</label>
                <input name="titulo" defaultValue={grupo.titulo} required className={inputClass} />
              </div>
              <button type="submit" className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900">
                Guardar
              </button>
              <button
                type="submit"
                formAction={deleteGrupo.bind(null, grupo.id)}
                className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
              >
                Eliminar grupo
              </button>
            </form>

            <div className="mt-4 space-y-3 border-t border-surface-border pt-4">
              {grupo.items.map((item) => (
                <form key={item.id} action={updateItem.bind(null, item.id)} className="flex flex-wrap items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-ink-500">Concepto</label>
                    <input name="label" defaultValue={item.label} required className={inputClass} />
                  </div>
                  <div className="w-40">
                    <label className="text-xs font-medium text-ink-500">Valor ($)</label>
                    <input name="valor" type="number" min="1" defaultValue={item.valor} required className={inputClass} />
                  </div>
                  <button type="submit" className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900">
                    Guardar
                  </button>
                  <button
                    type="submit"
                    formAction={deleteItem.bind(null, item.id)}
                    className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
                  >
                    Eliminar
                  </button>
                </form>
              ))}

              <form action={createItem.bind(null, grupo.id)} className="flex flex-wrap items-end gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-ink-500">Nuevo concepto</label>
                  <input name="label" placeholder="Ej: Día de viaje o fracción" required className={inputClass} />
                </div>
                <div className="w-40">
                  <label className="text-xs font-medium text-ink-500">Valor ($)</label>
                  <input name="valor" type="number" min="1" required className={inputClass} />
                </div>
                <button type="submit" className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600">
                  Agregar concepto
                </button>
              </form>
            </div>
          </div>
        ))}

        <form action={createGrupo} className="rounded-xl border border-dashed border-surface-border bg-surface p-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-ink-500">Título del nuevo grupo</label>
              <input name="titulo" placeholder="Ej: Art. 30° — Mensuras" required className={inputClass} />
            </div>
            <button type="submit" className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600">
              Agregar grupo
            </button>
          </div>
        </form>
      </div>

      {honorarioMinimo && (
        <>
          <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-ink-400">Honorario mínimo</h2>
          <div className="mt-4 rounded-xl border border-surface-border bg-white p-5">
            <div className="space-y-3">
              {honorarioMinimo.items.map((item) => (
                <form key={item.id} action={updateItem.bind(null, item.id)} className="flex flex-wrap items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-ink-500">Concepto</label>
                    <input name="label" defaultValue={item.label} required className={inputClass} />
                  </div>
                  <div className="w-40">
                    <label className="text-xs font-medium text-ink-500">Valor ($)</label>
                    <input name="valor" type="number" min="1" defaultValue={item.valor} required className={inputClass} />
                  </div>
                  <button type="submit" className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900">
                    Guardar
                  </button>
                  <button
                    type="submit"
                    formAction={deleteItem.bind(null, item.id)}
                    className="rounded-full border border-surface-border px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-accent-500 hover:text-accent-600"
                  >
                    Eliminar
                  </button>
                </form>
              ))}

              <form action={createItem.bind(null, honorarioMinimo.id)} className="flex flex-wrap items-end gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-ink-500">Nuevo concepto</label>
                  <input name="label" placeholder="Ej: 1 día de tarea en obra" required className={inputClass} />
                </div>
                <div className="w-40">
                  <label className="text-xs font-medium text-ink-500">Valor ($)</label>
                  <input name="valor" type="number" min="1" required className={inputClass} />
                </div>
                <button type="submit" className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600">
                  Agregar concepto
                </button>
              </form>
            </div>

            <div className="mt-4 space-y-1 border-t border-surface-border pt-4 text-sm">
              <div className="flex items-center justify-between text-ink-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-ink-600">
                <span>Adicional 10% Ley 4889 (calculado)</span>
                <span className="font-semibold">{formatCurrency(adicional)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-ink-900">
                <span>TOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
