import Link from "next/link";

type HeroInfoCardProps = {
  title: string;
  lines: string[];
  disclaimer?: string;
  signature?: string;
  href: string;
};

export function HeroInfoCard({ title, lines, disclaimer, signature, href }: HeroInfoCardProps) {
  return (
    <Link
      href={href}
      className="absolute bottom-0 left-1/2 hidden w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-1/2 rounded-xl bg-accent-500 px-8 py-6 text-center text-white shadow-lg transition-colors hover:bg-accent-600 sm:block"
    >
      <p className="text-xs font-bold uppercase tracking-wide">{title}</p>
      {lines.map((line) => (
        <p key={line} className="mt-2 text-lg font-bold first:mt-2">
          {line}
        </p>
      ))}
      {disclaimer && (
        <p className="mx-auto mt-3 max-w-sm text-[11px] leading-snug text-white/85">{disclaimer}</p>
      )}
      {signature && <p className="mt-1 text-[11px] font-semibold text-white/85">{signature}</p>}
    </Link>
  );
}
