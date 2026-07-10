import Image from "next/image";
import type { Directivo } from "@/lib/directorio";

function getInitials(nombre: string) {
  const words = nombre.replace(/^[A-Z]\.[A-Za-z.]*\s+/, "").split(" ").filter(Boolean);
  const relevant = words.slice(-2);
  return relevant.map((w) => w[0]).join("").toUpperCase();
}

export function DirectivoCard({ nombre, cargo, photo }: Directivo) {
  return (
    <div className="group flex flex-col items-center rounded-xl border border-surface-border bg-white px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg">
      {photo ? (
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary-50">
          <Image src={photo} alt={nombre} fill className="object-cover" />
        </div>
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-700 text-xl font-semibold text-white ring-4 ring-primary-50 transition-transform duration-300 group-hover:scale-105">
          {getInitials(nombre)}
        </div>
      )}
      <h3 className="mt-4 text-base font-semibold text-ink-900">{nombre}</h3>
      <p className="mt-1 text-sm font-medium text-primary-700">{cargo}</p>
    </div>
  );
}
