const NICHOS = [
  "Clínicas médicas",
  "Consultórios odontológicos",
  "Clínicas de estética",
  "Dermatologistas",
  "Cirurgiões plásticos",
  "Nutricionistas",
  "Psicólogos",
  "Fisioterapeutas",
  "Academias",
  "Centros de bem-estar",
] as const;

type PuzzleEdges = {
  left?: "socket";
  right?: "tab";
  top?: "socket";
  bottom?: "tab";
};

const ROW1_EDGES: PuzzleEdges[] = [
  { right: "tab", bottom: "tab" },
  { left: "socket", right: "tab" },
  { left: "socket", right: "tab", bottom: "tab" },
  { left: "socket", right: "tab" },
  { left: "socket" },
];

const ROW2_EDGES: PuzzleEdges[] = [
  { top: "socket", right: "tab" },
  { left: "socket", top: "socket", right: "tab" },
  { left: "socket", top: "socket", right: "tab" },
  { left: "socket", top: "socket", right: "tab" },
  { left: "socket", top: "socket" },
];

type MobileLayoutRow =
  | { kind: "pair"; indices: [number, number] }
  | { kind: "single"; index: number };

const MOBILE_LAYOUT: MobileLayoutRow[] = [
  { kind: "pair", indices: [0, 1] },
  { kind: "single", index: 2 },
  { kind: "pair", indices: [3, 4] },
  { kind: "single", index: 5 },
  { kind: "pair", indices: [6, 7] },
  { kind: "single", index: 8 },
  { kind: "single", index: 9 },
];

function amarelinhaEdges(rowIndex: number, role: "pair-left" | "pair-right" | "single"): PuzzleEdges {
  const hasTop = rowIndex > 0;
  const hasBottom = rowIndex < MOBILE_LAYOUT.length - 1;

  if (role === "pair-left") {
    return {
      ...(hasTop ? { top: "socket" as const } : {}),
      right: "tab",
      ...(hasBottom ? { bottom: "tab" as const } : {}),
    };
  }

  if (role === "pair-right") {
    return {
      left: "socket",
      ...(hasTop ? { top: "socket" as const } : {}),
      ...(hasBottom ? { bottom: "tab" as const } : {}),
    };
  }

  return {
    ...(hasTop ? { top: "socket" as const } : {}),
    ...(hasBottom ? { bottom: "tab" as const } : {}),
  };
}

function AmarelinhaMobile() {
  return (
    <div className="mx-auto w-full max-w-[300px] px-2 md:hidden">
      <div className="flex flex-col items-center">
        {MOBILE_LAYOUT.map((row, rowIndex) => {
          if (row.kind === "pair") {
            const [leftIndex, rightIndex] = row.indices;

            return (
              <div key={`pair-${leftIndex}`} className={`flex w-full ${rowIndex > 0 ? "-mt-[5px]" : ""}`}>
                <div className="w-1/2">
                  <PuzzlePiece
                    compact
                    fill
                    label={NICHOS[leftIndex]}
                    index={leftIndex + 1}
                    edges={amarelinhaEdges(rowIndex, "pair-left")}
                  />
                </div>
                <div className="w-1/2 -ml-[5px]">
                  <PuzzlePiece
                    compact
                    fill
                    label={NICHOS[rightIndex]}
                    index={rightIndex + 1}
                    edges={amarelinhaEdges(rowIndex, "pair-right")}
                  />
                </div>
              </div>
            );
          }

          return (
            <div key={`single-${row.index}`} className={`w-1/2 ${rowIndex > 0 ? "-mt-[5px]" : ""}`}>
              <PuzzlePiece
                compact
                fill
                label={NICHOS[row.index]}
                index={row.index + 1}
                edges={amarelinhaEdges(rowIndex, "single")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PuzzlePiece({
  label,
  index,
  edges,
  compact = false,
  fill = false,
}: {
  label: string;
  index: number;
  edges: PuzzleEdges;
  compact?: boolean;
  fill?: boolean;
}) {
  return (
    <span className={`group relative inline-flex ${fill ? "w-full" : "max-w-[46vw] shrink-0 sm:max-w-none"}`}>
      {edges.left === "socket" ? (
        <span
          className="pointer-events-none absolute left-0 top-1/2 z-0 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--ink)]/12 bg-[var(--muted-section)]"
          aria-hidden
        />
      ) : null}
      {edges.top === "socket" ? (
        <span
          className="pointer-events-none absolute left-1/2 top-0 z-0 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--ink)]/12 bg-[var(--muted-section)]"
          aria-hidden
        />
      ) : null}

      <span
        className={`relative z-[1] inline-flex w-full border border-[var(--ink)]/10 bg-white font-medium text-[var(--ink)]/75 transition duration-300 hover:z-10 hover:border-[#006CFF]/28 hover:bg-white hover:text-[var(--ink)] hover:shadow-[0_6px_18px_-8px_rgba(3,18,37,0.28)] ${
          compact
            ? fill
              ? "h-full min-h-[58px] flex-col items-center justify-center gap-0.5 px-1.5 py-2 text-center text-[10px] leading-tight"
              : "flex-col items-start gap-0.5 px-2 py-1.5 text-[11px] leading-tight"
            : "items-center gap-1.5 px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm"
        }`}
      >
        <span className="font-mono text-[9px] text-[#006CFF]/70">{String(index).padStart(2, "0")}</span>
        <span className={compact && fill ? "line-clamp-2 leading-snug" : compact ? "text-left leading-snug" : "whitespace-nowrap"}>
          {label}
        </span>

        {edges.right === "tab" ? (
          <span
            className="pointer-events-none absolute -right-[5px] top-1/2 z-[2] h-[9px] w-[9px] -translate-y-1/2 rounded-full border border-[var(--ink)]/10 bg-white [.group:hover_&]:border-[#006CFF]/35"
            aria-hidden
          />
        ) : null}
        {edges.bottom === "tab" ? (
          <span
            className="pointer-events-none absolute bottom-0 left-1/2 z-[2] h-[9px] w-[9px] -translate-x-1/2 translate-y-1/2 rounded-full border border-[var(--ink)]/10 bg-white [.group:hover_&]:border-[#9DFF2F]/45"
            aria-hidden
          />
        ) : null}
      </span>
    </span>
  );
}

function NicheBlocks() {
  const row1 = NICHOS.slice(0, 5);
  const row2 = NICHOS.slice(5);

  return (
    <>
      <AmarelinhaMobile />

      <div className="hidden flex-col items-center md:flex">
        <div className="flex items-center -space-x-[5px]">
          {row1.map((label, i) => (
            <PuzzlePiece key={label} label={label} index={i + 1} edges={ROW1_EDGES[i]} />
          ))}
        </div>
        <div className="flex items-center -mt-[5px] -space-x-[5px] pl-10 lg:pl-14">
          {row2.map((label, i) => (
            <PuzzlePiece key={label} label={label} index={i + 6} edges={ROW2_EDGES[i]} />
          ))}
        </div>
      </div>
    </>
  );
}

function NicheMarquee({ reverse = false, outline = false }: { reverse?: boolean; outline?: boolean }) {
  const row = [...NICHOS, ...NICHOS];

  return (
    <div className="para-quem-marquee relative flex overflow-hidden">
      <div
        className={`flex w-max shrink-0 items-center gap-4 py-1 ${reverse ? "animate-para-quem-marquee-reverse" : "animate-para-quem-marquee"}`}
      >
        {row.map((nicho, i) => (
          <span key={`${nicho}-${i}`} className="flex items-center gap-4">
            <span
              className={`whitespace-nowrap text-[clamp(1.15rem,2.8vw,2.35rem)] font-black uppercase leading-none tracking-tight transition-colors duration-300 ${
                outline
                  ? "text-transparent [-webkit-text-stroke:1px_rgba(3,18,37,0.2)] hover:[-webkit-text-stroke-color:rgba(0,108,255,0.55)]"
                  : "text-[var(--ink)]/70 hover:text-[#006CFF]"
              }`}
            >
              {nicho}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0 text-[#9DFF2F]">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function ParaQuem() {
  return (
    <section
      id="para-quem"
      className="section-muted relative isolate overflow-hidden border-y border-[var(--ink)]/8 py-14 sm:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(3,18,37,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(3,18,37,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <p
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(4rem,14vw,10rem)] font-black uppercase leading-[0.85] tracking-tighter text-[var(--ink)]/[0.04]"
        aria-hidden
      >
        saúde
      </p>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--ink)]/10 bg-white/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--ink)]/55">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F]" />
              Para quem trabalhamos
            </div>
            <h2 className="mt-4 max-w-2xl text-balance text-[clamp(1.75rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--ink)]">
              Especialistas <span className="text-gradient-brand">dedicados</span> ao setor de saúde e estética.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--ink)]/65 sm:text-base">
              Não fazemos marketing para qualquer nicho. Cada estratégia, criativo e funil é desenhado considerando
              regulamentações, jornada do paciente e comportamento de compra do nosso mercado.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start lg:items-end">
            <span className="text-[clamp(3rem,7vw,4.5rem)] font-black leading-none tracking-tighter text-gradient-brand">
              10
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--ink)]/45">
              nichos que dominamos
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 space-y-2 sm:mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--muted-section)] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--muted-section)] to-transparent sm:w-20" />
        <NicheMarquee />
        <NicheMarquee reverse outline />
      </div>

      <div className="relative z-10 mx-auto mt-8 flex justify-center px-6 sm:mt-10 lg:px-10">
        <NicheBlocks />
      </div>
    </section>
  );
}
