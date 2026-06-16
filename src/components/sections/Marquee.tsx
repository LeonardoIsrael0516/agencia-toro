const ITEMS_PRIMARY = [
  { text: "Estratégia.", accent: false },
  { text: "Dados.", accent: false },
  { text: "Criatividade.", accent: true },
  { text: "Performance.", accent: false },
  { text: "Resultados.", accent: true },
  { text: "Agenda cheia.", accent: false },
] as const;

const ITEMS_SECONDARY = [
  { text: "Tráfego pago.", accent: false },
  { text: "Funis de venda.", accent: false },
  { text: "Saúde & estética.", accent: true },
  { text: "Instagram.", accent: false },
  { text: "Conversão.", accent: true },
  { text: "Crescimento.", accent: false },
] as const;

type MarqueeItem = { text: string; accent: boolean };

function RaindropIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0 text-[#00D8FF]/80">
      <path
        d="M12 2.2C8.2 7 5.5 10.6 5.5 14.2a6.5 6.5 0 1 0 13 0C18.5 10.6 15.8 7 12 2.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0 text-[#9DFF2F]">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
    </svg>
  );
}

function MarqueeTrack({
  items,
  reverse = false,
}: {
  items: readonly MarqueeItem[];
  reverse?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`flex w-max gap-10 whitespace-nowrap px-5 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
    >
      {row.map((item, i) => (
        <span key={`${item.text}-${i}`} className="flex items-center gap-10">
          <span
            className={`text-xl font-medium tracking-tight sm:text-2xl ${
              item.accent ? "text-gradient-brand" : "text-foreground/75"
            }`}
          >
            {item.text}
          </span>
          {i % 2 === 0 ? <RaindropIcon /> : <BoltIcon />}
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee-band group relative overflow-hidden border-y border-white/[0.06] bg-[var(--ink-2)] py-5">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-brand opacity-60"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--ink-2)] to-transparent sm:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--ink-2)] to-transparent sm:w-32"
        aria-hidden
      />

      <div className="marquee-pause flex flex-col gap-3">
        <MarqueeTrack items={ITEMS_PRIMARY} />
        <div className="opacity-40">
          <MarqueeTrack items={ITEMS_SECONDARY} reverse />
        </div>
      </div>
    </div>
  );
}
