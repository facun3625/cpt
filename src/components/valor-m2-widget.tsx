"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";

type ValorM2WidgetProps = {
  valorVigente: number;
  vigenteHasta?: string | null;
  valorProximo?: number | null;
  proximoDesde?: string | null;
};

export function ValorM2Widget({ valorVigente, vigenteHasta, valorProximo, proximoDesde }: ValorM2WidgetProps) {
  const [m2, setM2] = useState("");

  const resultado = useMemo(() => {
    const value = Number(m2.replace(",", "."));
    if (!m2 || Number.isNaN(value) || value <= 0) return null;
    return value * valorVigente;
  }, [m2, valorVigente]);

  return (
    <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-ink-900">Valor vigente del m²</h3>
        <span className="text-xs font-medium text-ink-400">Actualizado desde el panel</span>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          {valorProximo ? (
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              {vigenteHasta ? `Hasta el ${vigenteHasta}` : "Vigente"}
            </p>
          ) : null}
          <p className="text-3xl font-bold text-primary-700">{formatCurrency(valorVigente)}</p>
        </div>
        {valorProximo && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              {proximoDesde ? `Desde el ${proximoDesde}` : "Próximo valor"}
            </p>
            <p className="text-xl font-semibold text-ink-600">{formatCurrency(valorProximo)}</p>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-ink-400">
        Todos los aportes generados con el valor vigente caducarán a los 30 días del cambio del
        nuevo valor por m². Los aportes pendientes se actualizarán al nuevo valor en forma automática.
      </p>
      <p className="mt-1 text-xs font-semibold text-ink-400">El Directorio</p>

      <div id="calculadora" className="mt-6 scroll-mt-24 border-t border-surface-border pt-6">
        <label htmlFor="m2-input" className="block text-sm font-medium text-ink-900">
          Calculá el valor según tus metros cuadrados
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="m2-input"
            type="text"
            inputMode="decimal"
            placeholder="Cantidad de m²"
            value={m2}
            onChange={(e) => setM2(e.target.value)}
            className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:w-56"
          />
          <div className="flex flex-1 items-center rounded-lg bg-surface px-4 py-2.5 text-sm font-semibold text-primary-700">
            {resultado !== null ? formatCurrency(resultado) : "Ingresá los m² para calcular"}
          </div>
        </div>
      </div>
    </div>
  );
}
