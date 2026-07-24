"use client";

import { useState } from "react";
import { aprobarSolicitud } from "@/app/admin/(panel)/certificados/actions";
import { SubmitButtonPending } from "@/components/admin/submit-button-pending";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function AprobarCertificadoForm({ id }: { id: string }) {
  const [modelo, setModelo] = useState<"ANUAL" | "CUOTAS">("ANUAL");
  const anioActual = new Date().getFullYear();

  return (
    <form action={aprobarSolicitud.bind(null, id)} className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-sm font-semibold text-emerald-800">Aprobar solicitud</h2>
      <p className="mt-1 text-xs text-emerald-700">
        Elegí el modelo de certificado. Genera el PDF con QR de verificación y envía el enlace por email.
      </p>

      <div className="mt-3">
        <label className="text-xs font-medium text-emerald-800">Modelo</label>
        <select
          name="modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value as "ANUAL" | "CUOTAS")}
          className={inputClass}
        >
          <option value="ANUAL">Modelo 1 — Pago anual</option>
          <option value="CUOTAS">Modelo 2 — Pago en cuotas</option>
        </select>
      </div>

      {modelo === "CUOTAS" && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-medium text-emerald-800">Cant. cuotas</label>
            <input
              name="cantidadCuotas"
              type="number"
              min={1}
              max={12}
              required
              defaultValue={6}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-emerald-800">Mes vencimiento</label>
            <select name="cuotaVencimientoMes" required defaultValue={10} className={inputClass}>
              {MESES.map((mes, i) => (
                <option key={mes} value={i + 1}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-emerald-800">Año vencimiento</label>
            <input
              name="cuotaVencimientoAnio"
              type="number"
              required
              defaultValue={anioActual}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <SubmitButtonPending
        pendingText="Generando certificado…"
        className="mt-4 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Aprobar y emitir
      </SubmitButtonPending>
    </form>
  );
}
