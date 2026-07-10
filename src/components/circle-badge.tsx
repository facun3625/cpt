import Link from "next/link";

type CircleBadgeProps = {
  ringText: string;
  label: string;
  href: string;
};

export function CircleBadge({ ringText, label, href }: CircleBadgeProps) {
  const text = `${ringText}  ·  `;

  return (
    <Link
      href={href}
      className="group relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-105 sm:h-32 sm:w-32"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_20s_linear_infinite]">
        <path
          id="circle-badge-path"
          d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
          fill="none"
        />
        <text fill="#0c4d47" fontSize="12.5" fontWeight="700" letterSpacing="2">
          <textPath href="#circle-badge-path" startOffset="0%">
            {text.repeat(2)}
          </textPath>
        </text>
      </svg>
      <span className="relative flex flex-col items-center gap-0.5 text-primary-700">
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
