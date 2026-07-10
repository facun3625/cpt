"use client";

import { useSedeHeader } from "./sede-header-context";

export function SedeHeaderCheckbox({ sedeId, formId }: { sedeId: string; formId: string }) {
  const { checked, toggle } = useSedeHeader();

  return (
    <label className="mt-4 flex items-center gap-2 text-sm text-ink-600">
      <input
        type="checkbox"
        name="mostrarEnHeader"
        form={formId}
        checked={checked.has(sedeId)}
        onChange={() => toggle(sedeId)}
        className="h-4 w-4 rounded border-surface-border"
      />
      Mostrar teléfono en el header (máx. 2)
    </label>
  );
}
