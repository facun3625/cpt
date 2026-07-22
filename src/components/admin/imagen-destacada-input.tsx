"use client";

import { useState } from "react";

const fileInputClass =
  "mt-2 block w-full text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-900";

export function ImagenDestacadaInput({ name, initialUrl }: { name: string; initialUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [broken, setBroken] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(initialUrl);
      setBroken(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
      setBroken(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="text-xs font-medium text-ink-500">Imagen destacada</label>
      <div className="mt-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-surface-border bg-surface">
        {preview && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
        ) : (
          <span className="text-xs text-ink-400">Sin imagen</span>
        )}
      </div>
      <input name={name} type="file" accept="image/*" onChange={handleChange} className={fileInputClass} />
    </div>
  );
}
