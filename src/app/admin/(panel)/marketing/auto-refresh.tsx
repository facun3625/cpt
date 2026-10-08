"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Refresca los datos del servidor cada tanto, para ver avanzar el progreso de los envíos. */
export function AutoRefresh({ cadaMs = 30_000 }: { cadaMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), cadaMs);
    return () => clearInterval(t);
  }, [router, cadaMs]);
  return null;
}
