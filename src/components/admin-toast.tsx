"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AdminToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ok = searchParams.get("ok");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ok) return;
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), 2200);
    const clean = setTimeout(() => router.replace(pathname), 2600);
    return () => {
      clearTimeout(hide);
      clearTimeout(clean);
    };
  }, [ok, pathname, router]);

  if (!ok) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2" />
        <path d="M8 12.5 10.5 15 16 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Cambios guardados
    </div>
  );
}
