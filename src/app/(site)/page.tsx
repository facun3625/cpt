import Image from "next/image";
import Link from "next/link";
import { quickAccess } from "@/lib/nav";
import { HeroInfoCard } from "@/components/hero-info-card";
import { HeroNewsSlider, type HeroSlide } from "@/components/hero-news-slider";
import { NoticiasGrid } from "@/components/noticias-grid";
import { NewsletterForm } from "@/components/newsletter-form";
import { ChatCtaButton } from "@/components/chat-cta-button";
import { getValorM2Status, getValorM2DisplayProps, getNoticias, getSliderNoticias } from "@/lib/site-info";
import { formatCurrency } from "@/lib/format";

const quickAccessStyle = [
  {
    color: "bg-accent-500",
    ring: "ring-accent-500/15",
    icon: <path d="M4 20V10l8-6 8 6v10M4 20h16M4 20v-6h4v6M14 14h4v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "bg-primary-600",
    ring: "ring-primary-600/15",
    icon: <path d="M9 5h6M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "bg-primary-900",
    ring: "ring-primary-900/15",
    icon: <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7ZM4 12h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "bg-accent-600",
    ring: "ring-accent-600/15",
    icon: <path d="M4 6h16v12H4V6Zm4-2v2m8-2v2M4 11h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "bg-primary-600",
    ring: "ring-primary-600/15",
    icon: <path d="M12 3 4 6.5V11c0 4.5 3.2 7.9 8 9 4.8-1.1 8-4.5 8-9V6.5L12 3Zm0 4v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "bg-primary-900",
    ring: "ring-primary-900/15",
    icon: <path d="M5 4h11a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V4Zm0 0a2 2 0 0 0-2 2v10M8 8h6M8 12h6M8 16h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "bg-accent-500",
    ring: "ring-accent-500/15",
    icon: <path d="M8 3v3m8-3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 8 2.5 2.5L15.5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "bg-primary-600",
    ring: "ring-primary-600/15",
    icon: <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm4 2h4v4H7v-4Zm7 1h5m-5 3h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export default async function Home() {
  const valorM2Status = await getValorM2Status();
  const valorM2 = getValorM2DisplayProps(valorM2Status);
  const valorM2Lines = valorM2.valorProximo
    ? [
        `${valorM2.vigenteHasta ? `Hasta el ${valorM2.vigenteHasta}` : "Vigente"}: ${formatCurrency(valorM2.valorVigente)}`,
        `${valorM2.proximoDesde ? `Desde el ${valorM2.proximoDesde}` : "Próximo valor"}: ${formatCurrency(valorM2.valorProximo)}`,
      ]
    : [formatCurrency(valorM2.valorVigente)];

  const [noticias, sliderNoticias] = await Promise.all([getNoticias("NOTICIA"), getSliderNoticias()]);
  const [destacadas, resto] = [noticias.slice(0, 3), noticias.slice(3, 13)];
  const heroSlides: HeroSlide[] = sliderNoticias.map((n) => ({
    title: n.titulo,
    excerpt: n.pretexto ?? "",
    href: `/noticias/${n.slug}`,
  }));

  return (
    <>
      <section className="relative min-h-[460px] overflow-visible bg-ink-900 sm:min-h-[560px] lg:min-h-[660px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/hero.png" alt="Obra en construcción" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-ink-900/70" />
        </div>

        <div
          className="absolute inset-x-0 flex flex-col items-center justify-center px-4 text-center sm:px-6"
          style={{ top: "var(--site-header-h, 240px)", bottom: "100px" }}
        >
          <HeroNewsSlider slides={heroSlides} />
        </div>

        <svg
          className="absolute inset-x-0 bottom-0 block h-16 w-full text-surface"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,20 C320,20 460,85 720,85 C980,85 1120,20 1440,20 L1440,100 L0,100 Z"
            fill="currentColor"
          />
        </svg>

        <HeroInfoCard
          title="Valor del metro cuadrado"
          lines={valorM2Lines}
          disclaimer="Todos los aportes generados con el valor vigente caducarán a los 30 días del cambio del nuevo valor por m². Los aportes pendientes se actualizarán al nuevo valor en forma automática."
          signature="El Directorio"
          href="/valor-m2"
        />
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-44 lg:px-8">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-primary-100 bg-white px-6 py-8 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-accent-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 4h16v12H8l-4 4V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink-900">¿Tenés una consulta? Preguntale a nuestro asistente virtual</h2>
                <p className="mt-1 text-sm text-ink-600">
                  Respuestas al instante sobre matriculación, aranceles, valor del m² y más, con el link a la página correspondiente.
                </p>
              </div>
            </div>
            <ChatCtaButton className="shrink-0 rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600">
              Preguntarle al asistente
            </ChatCtaButton>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Noticias y novedades</h2>
              <p className="mt-2 text-ink-600">Comunicados institucionales y actualidad del sector.</p>
            </div>
            <Link href="/noticias" className="text-sm font-semibold text-primary-700 hover:text-primary-900">
              Ver todas las noticias →
            </Link>
          </div>

          <div className="mt-8">
            <NoticiasGrid items={destacadas} basePath="/noticias" />
          </div>

          <div className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {resto.map((n) => (
              <Link
                key={n.slug}
                href={`/noticias/${n.slug}`}
                className="group border-t-2 border-surface-border pt-4 transition-[border-color,padding] duration-300 hover:border-primary-500 hover:pl-2"
              >
                <h3 className="text-sm font-semibold leading-snug text-ink-900 line-clamp-2 transition-colors group-hover:text-primary-700">
                  {n.titulo}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                  Ingresar
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Accesos rápidos</h2>
        <p className="mt-2 text-ink-600">Lo que más buscan matriculados y empresas.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-surface-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full text-white ring-8 transition-transform duration-300 group-hover:scale-110 ${quickAccessStyle[index].color} ${quickAccessStyle[index].ring}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {quickAccessStyle[index].icon}
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink-900 group-hover:text-primary-700">
                {item.label}
              </h3>
              <p className="mt-2 text-sm text-ink-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Suscribite a nuestro newsletter</h2>
          <p className="mt-2 text-white/70">
            Recibí las novedades institucionales, vencimientos y noticias del sector directo en tu email.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
