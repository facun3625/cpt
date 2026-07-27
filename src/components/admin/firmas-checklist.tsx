type Firma = { id: string; nombre: string; titulo: string };

export function FirmasChecklist({
  firmas,
  seleccionadas = [],
  labelClassName,
}: {
  firmas: Firma[];
  seleccionadas?: string[];
  labelClassName: string;
}) {
  if (firmas.length === 0) {
    return (
      <p className={`mt-3 text-xs ${labelClassName}`}>
        No hay firmas cargadas todavía — se puede aprobar sin firmas y agregarlas después regenerando.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <label className={`text-xs font-medium ${labelClassName}`}>Firmas a incluir</label>
      <div className="mt-1.5 space-y-1.5">
        {firmas.map((firma) => (
          <label key={firma.id} className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              name="firmaIds"
              value={firma.id}
              defaultChecked={seleccionadas.includes(firma.id)}
              className="h-4 w-4 rounded border-surface-border"
            />
            {firma.nombre} <span className="text-ink-400">— {firma.titulo}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
