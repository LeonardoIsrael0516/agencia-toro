import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const PONTOS = [
  "Atendimento dedicado de squad multidisciplinar",
  "Reuniões mensais de performance com dashboards próprios",
  "Especialistas no setor de saúde. Entendemos regulamentação e ticket alto",
  "Treinamos sua equipe interna para sustentar o crescimento",
] as const;

function DiferencialPonto({ texto, index }: { texto: string; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.6 });
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const active = !canHover && inView;

  return (
    <li
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--ink)]/8 bg-white p-5 transition duration-500 sm:p-6",
        "hover:border-[#006CFF]/20 hover:shadow-[0_12px_32px_-20px_rgba(3,18,37,0.18)]",
        active && "border-[#006CFF]/20 shadow-[0_12px_32px_-20px_rgba(3,18,37,0.18)]",
        !canHover && "transition duration-700 ease-out",
        !canHover && (inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"),
      )}
      style={!canHover ? { transitionDelay: `${index * 100}ms` } : undefined}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-brand transition-transform duration-500",
          "group-hover:scale-y-100",
          active && "scale-y-100",
        )}
      />

      <div className="relative flex items-start gap-4">
        <span className="font-mono text-xs text-[#006CFF]/70">{String(index + 1).padStart(2, "0")}</span>
        <p className="flex-1 text-base leading-relaxed text-[var(--ink)]/80">{texto}</p>
      </div>
    </li>
  );
}

export function Diferencial() {
  return (
    <section
      id="cultura"
      className="section-light relative border-y border-[var(--ink)]/8 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--ink)]/10 bg-white/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--ink)]/55">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F]" />
              O diferencial Toró
            </div>

            <h2 className="mt-6 max-w-xl text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--ink)]">
              Não vendemos visibilidade. Vendemos{" "}
              <span className="text-gradient-brand">crescimento previsível.</span>
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-sm">
              <span className="rounded-full border border-[var(--ink)]/8 bg-[var(--ink)]/[0.03] px-3 py-1 text-[var(--ink)]/40">
                Visibilidade
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="text-[var(--ink)]/25">
                <path
                  d="m9 6 6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="rounded-full border border-[#006CFF]/15 bg-[#006CFF]/[0.06] px-3 py-1 font-medium text-[#006CFF]">
                Crescimento previsível
              </span>
            </div>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--ink)]/65">
              Geramos tráfego, captamos leads, estruturamos processos comerciais, treinamos equipes e acompanhamos
              indicadores para garantir que o investimento em marketing se transforme em faturamento.
            </p>
          </div>

          <ul className="relative space-y-4">
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-[18px] top-4 hidden w-px bg-gradient-to-b from-[#006CFF]/25 via-[#00D8FF]/20 to-[#9DFF2F]/30 lg:block"
            />
            {PONTOS.map((ponto, i) => (
              <DiferencialPonto key={ponto} texto={ponto} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
