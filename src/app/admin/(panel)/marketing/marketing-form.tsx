"use client";

import { useMemo, useState } from "react";
import { construirEmailHtml, type EmailFooterInfo } from "@/lib/email-template";
import { enviarCampania } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const textareaClass = `${inputClass} resize-y`;
const fileInputClass =
  "mt-2 block text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

export function MarketingForm({
  suscriptoresCount,
  matriculadosCount,
  siteUrl,
  footer,
}: {
  suscriptoresCount: number;
  matriculadosCount: number;
  siteUrl: string;
  footer: EmailFooterInfo;
}) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenPosicion, setImagenPosicion] = useState<"antes" | "despues">("antes");

  const previewHtml = useMemo(
    () =>
      construirEmailHtml({
        titulo: titulo || "Título del correo",
        contenido: contenido || "El contenido de tu mensaje aparecerá acá a medida que lo escribís.",
        imagenUrl: imagenPreview,
        imagenPosicion,
        siteUrl,
        footer,
      }),
    [titulo, contenido, imagenPreview, imagenPosicion, siteUrl, footer],
  );

  function handleImagenChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImagenPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagenPreview(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <form action={enviarCampania} className="space-y-5 rounded-xl border border-surface-border bg-white p-6">
        <div>
          <label className="text-xs font-medium text-ink-500">Título / asunto</label>
          <input
            name="titulo"
            required
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Texto</label>
          <textarea
            name="contenido"
            required
            rows={6}
            className={textareaClass}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Imagen (opcional)</label>
          <input
            name="imagen"
            type="file"
            accept="image/jpeg,image/png"
            className={fileInputClass}
            onChange={handleImagenChange}
          />
          <div className="mt-3 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input
                type="radio"
                name="imagenPosicion"
                value="antes"
                checked={imagenPosicion === "antes"}
                onChange={() => setImagenPosicion("antes")}
                className="accent-primary-700"
              />
              Antes del texto
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input
                type="radio"
                name="imagenPosicion"
                value="despues"
                checked={imagenPosicion === "despues"}
                onChange={() => setImagenPosicion("despues")}
                className="accent-primary-700"
              />
              Después del texto
            </label>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Destinatarios</label>
          <select name="destinatarios" defaultValue="SUSCRIPTORES" className={inputClass}>
            <option value="SUSCRIPTORES">Suscriptores del newsletter ({suscriptoresCount})</option>
            <option value="MATRICULADOS">Matriculados con email cargado ({matriculadosCount})</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>

        <p className="text-xs text-ink-400">
          El envío se hace en el momento y puede tardar unos minutos si la lista es grande — no cierres esta página
          hasta que redirija.
        </p>

        <button
          type="submit"
          className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
        >
          Enviar campaña
        </button>
      </form>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-xs font-medium text-ink-500">Preview del email</p>
        <div className="overflow-hidden rounded-xl border border-surface-border bg-surface">
          <iframe title="Preview del email" srcDoc={previewHtml} className="h-[600px] w-full bg-white" />
        </div>
      </div>
    </div>
  );
}
