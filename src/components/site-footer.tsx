import Image from "next/image";
import Link from "next/link";
import { mainNav } from "@/lib/nav";
import type { Sede, ContactEmail } from "@/generated/prisma/client";

export function SiteFooter({ sedes, emails }: { sedes: Sede[]; emails: ContactEmail[] }) {
  return (
    <footer id="contacto" className="border-t border-surface-border bg-primary-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-1">
          <Image src="/logo.png" alt="CPT Santa Fe" width={120} height={55} className="h-11 w-auto rounded" />
          <p className="text-sm leading-relaxed text-primary-100">
            Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-100">Navegación</h3>
          <ul className="mt-4 space-y-2">
            {mainNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-white/80 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-100">Sedes</h3>
          <ul className="mt-4 space-y-4">
            {sedes.map((sede) => (
              <li key={sede.id} className="text-sm text-white/80">
                <p className="font-medium text-white">{sede.nombre}</p>
                <p>{sede.direccion}</p>
                <p>{sede.telefono}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-100">Contacto</h3>
          <ul className="mt-4 space-y-2">
            {emails.map((email) => (
              <li key={email.id} className="text-sm text-white/80">
                <span className="text-white/60">{email.label}:</span>{" "}
                <a href={`mailto:${email.value}`} className="hover:text-white">
                  {email.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-xs text-white/60">
          © {new Date().getFullYear()} CPT Santa Fe. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
