"use client";

import { useActionState, useState } from "react";
import { uploadMatriculados, type UploadState } from "@/app/admin/(panel)/matriculados/actions";

type UploadInfo = { uploadedAtText: string; cantidad: number; nombreArchivo: string } | null;

export function MatriculadosUploadForm({ uploadInfo }: { uploadInfo: UploadInfo }) {
  const [state, formAction, pending] = useActionState<UploadState, FormData>(uploadMatriculados, undefined);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-surface-border bg-white p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700/10 text-primary-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 4v11m0-11 4 4m-4-4-4 4M5 17v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink-900">Subir lista de matriculados habilitados</h2>
          <p className="mt-1 text-sm text-ink-600">
            El archivo debe ser un CSV con las columnas <strong>numero_documento</strong>, <strong>nombre</strong>,{" "}
            <strong>apellido</strong> y <strong>numero_matricula</strong> (opcionalmente <strong>email</strong>).{" "}
            <a
              href="/ejemplo-matriculados.csv"
              download
              className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-900"
            >
              Descargar planilla de ejemplo
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent-500/10 px-3.5 py-2.5 text-xs font-medium text-accent-700">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Cada subida reemplaza por completo la lista actual — no se acumulan cargas anteriores.
      </div>

      {uploadInfo && (
        <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink-300">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Última carga: {uploadInfo.uploadedAtText} · {uploadInfo.cantidad} matriculados · {uploadInfo.nombreArchivo}
        </div>
      )}

      <form action={formAction} className="mt-5 flex flex-wrap items-center gap-3 rounded-lg bg-surface p-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 4v11m0-11 4 4m-4-4-4 4M5 17v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Seleccionar archivo
          <input
            name="archivo"
            type="file"
            accept=".csv"
            required
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            className="hidden"
          />
        </label>

        <span className="flex-1 truncate text-sm text-ink-500">
          {fileName ?? "Ningún archivo seleccionado"}
        </span>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          {pending ? "Subiendo…" : "Reemplazar lista"}
        </button>
      </form>

      {state?.error && <p className="mt-3 text-sm font-medium text-accent-600">{state.error}</p>}
    </div>
  );
}
