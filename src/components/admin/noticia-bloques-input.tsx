"use client";

import { useState } from "react";

type Bloque =
  | { key: string; tipo: "TEXTO"; texto: string }
  | { key: string; tipo: "IMAGEN"; existingUrl: string | null; preview: string | null };

let contador = 0;
function nuevaKey() {
  contador += 1;
  return `bloque-${Date.now()}-${contador}`;
}

const textareaClass =
  "mt-1 w-full resize-y rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-400";
const fileInputClass =
  "mt-2 block w-full text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

export function NoticiaBloquesInput({
  initialBloques,
}: {
  initialBloques: { tipo: "TEXTO" | "IMAGEN"; texto: string | null; imagenUrl: string | null }[];
}) {
  const [bloques, setBloques] = useState<Bloque[]>(() =>
    initialBloques.map((b) =>
      b.tipo === "TEXTO"
        ? { key: nuevaKey(), tipo: "TEXTO", texto: b.texto ?? "" }
        : { key: nuevaKey(), tipo: "IMAGEN", existingUrl: b.imagenUrl, preview: b.imagenUrl },
    ),
  );

  function agregarTexto() {
    setBloques((prev) => [...prev, { key: nuevaKey(), tipo: "TEXTO", texto: "" }]);
  }

  function agregarImagen() {
    setBloques((prev) => [...prev, { key: nuevaKey(), tipo: "IMAGEN", existingUrl: null, preview: null }]);
  }

  function eliminar(key: string) {
    setBloques((prev) => prev.filter((b) => b.key !== key));
  }

  function mover(key: string, direccion: -1 | 1) {
    setBloques((prev) => {
      const index = prev.findIndex((b) => b.key === key);
      const destino = index + direccion;
      if (destino < 0 || destino >= prev.length) return prev;
      const copia = [...prev];
      [copia[index], copia[destino]] = [copia[destino], copia[index]];
      return copia;
    });
  }

  function actualizarTexto(key: string, texto: string) {
    setBloques((prev) => prev.map((b) => (b.key === key && b.tipo === "TEXTO" ? { ...b, texto } : b)));
  }

  function handleImagenChange(key: string, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const preview = typeof reader.result === "string" ? reader.result : null;
      setBloques((prev) => prev.map((b) => (b.key === key && b.tipo === "IMAGEN" ? { ...b, preview } : b)));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="text-xs font-medium text-ink-500">Cuerpo de la publicación</label>
      <p className="mt-1 text-xs text-ink-400">
        Armá el contenido agregando bloques de texto e imágenes en el orden en que querés que aparezcan.
      </p>

      <div className="mt-3 space-y-3">
        {bloques.map((bloque, i) => (
          <div key={bloque.key} className="rounded-lg border border-surface-border bg-surface p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                {bloque.tipo === "TEXTO" ? "Texto" : "Imagen"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => mover(bloque.key, -1)}
                  disabled={i === 0}
                  className="rounded-full border border-surface-border px-2 py-1 text-xs font-semibold text-ink-500 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Mover arriba"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => mover(bloque.key, 1)}
                  disabled={i === bloques.length - 1}
                  className="rounded-full border border-surface-border px-2 py-1 text-xs font-semibold text-ink-500 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Mover abajo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => eliminar(bloque.key)}
                  className="rounded-full border border-surface-border px-2 py-1 text-xs font-semibold text-ink-500 transition-colors hover:border-accent-500 hover:text-accent-600"
                  title="Eliminar bloque"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <input type="hidden" name={`bloque_${i}_tipo`} value={bloque.tipo} />

            {bloque.tipo === "TEXTO" ? (
              <textarea
                name={`bloque_${i}_texto`}
                value={bloque.texto}
                onChange={(e) => actualizarTexto(bloque.key, e.target.value)}
                rows={6}
                placeholder="Escribí el texto de este bloque…"
                className={textareaClass}
              />
            ) : (
              <div className="mt-2">
                {bloque.preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bloque.preview} alt="" className="h-40 w-full rounded-lg object-cover" />
                )}
                <input type="hidden" name={`bloque_${i}_imagenUrl`} value={bloque.existingUrl ?? ""} />
                <input
                  name={`bloque_${i}_imagen`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImagenChange(bloque.key, e.target.files?.[0] ?? null)}
                  className={fileInputClass}
                />
              </div>
            )}
          </div>
        ))}

        {bloques.length === 0 && (
          <p className="rounded-lg border border-dashed border-surface-border bg-surface p-4 text-sm text-ink-400">
            Todavía no agregaste ningún bloque de contenido.
          </p>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={agregarTexto}
          className="rounded-full border border-surface-border px-4 py-2 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
        >
          + Agregar texto
        </button>
        <button
          type="button"
          onClick={agregarImagen}
          className="rounded-full border border-surface-border px-4 py-2 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-400 hover:text-primary-700"
        >
          + Agregar imagen
        </button>
      </div>
    </div>
  );
}
