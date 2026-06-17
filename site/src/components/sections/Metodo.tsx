import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const VERBS = ["Planejar", "Executar", "Analisar", "Crescer"] as const;

const STEPS = [
  {
    n: "01",
    t: "Diagnóstico",
    d: "Mergulhamos no seu negócio: histórico, indicadores, concorrência e oportunidades não exploradas.",
  },
  {
    n: "02",
    t: "Estratégia",
    d: "Plano de crescimento personalizado com canais, ofertas e funis adequados ao seu segmento.",
  },
  {
    n: "03",
    t: "Execução",
    d: "Tráfego, conteúdo, automações e treinamento comercial rodando em paralelo com squad dedicado.",
  },
  {
    n: "04",
    t: "Otimização",
    d: "Análise contínua de dados e reuniões de performance para escalar o que funciona e cortar o que não.",
  },
] as const;

function MetodoStep({
  step,
  index,
  isLast,
  mobile = false,
}: {
  step: (typeof STEPS)[number];
  index: number;
  isLast: boolean;
  mobile?: boolean;
}) {
  const { ref, inView } = useInView({ threshold: 0.45 });
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const active = !canHover && inView;

  return (
    <article
      ref={ref}
      className={cn(
        "group relative flex gap-5 lg:block",
        mobile && "transition duration-700 ease-out",
        mobile && (inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
      )}
      style={mobile ? { transitionDelay: `${index * 120}ms` } : undefined}
    >
      <div className="flex shrink-0 flex-col items-center lg:contents">
        <div
          className={cn(
            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border bg-[var(--ink)] transition duration-500 lg:mx-auto lg:mb-6 lg:h-14 lg:w-14",
            "border-white/15 group-hover:border-[#006CFF]/45",
            active && "border-[#006CFF]/45",
            mobile && inView && "border-[#006CFF]/40 shadow-[0_0_0_4px_rgba(0,108,255,0.12)]",
          )}
        >
          <span
            className={cn(
              "font-mono text-[11px] font-medium text-white/55 transition duration-300 lg:text-xs",
              "group-hover:text-gradient-brand",
              active && "text-gradient-brand",
            )}
          >
            {step.n}
          </span>
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500",
              "bg-gradient-to-br from-[#006CFF]/20 via-transparent to-[#9DFF2F]/15",
              "group-hover:opacity-100",
              active && "opacity-100",
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-2xl border border-white/8 bg-[var(--ink-2)]/55 p-5 transition duration-500 sm:p-6 lg:mt-0",
          "hover:border-white/14 hover:bg-[var(--ink-2)]/80",
          active && "border-white/14 bg-[var(--ink-2)]/80",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
            "bg-gradient-to-br from-[#006CFF]/[0.08] via-transparent to-[#9DFF2F]/[0.06]",
            "group-hover:opacity-100",
            active && "opacity-100",
          )}
        />

        <div className="relative">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#00D8FF]/70">
            {VERBS[index]}
          </span>
          <h3 className="mt-2 text-lg font-semibold leading-tight sm:text-xl">{step.t}</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/60">{step.d}</p>
        </div>

        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-brand transition-transform duration-500",
            "group-hover:scale-x-100",
            active && "scale-x-100",
          )}
        />

        {isLast ? (
          <div className="relative mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/40">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="text-[#9DFF2F]/80">
              <path
                d="M12 4a8 8 0 1 1-2.34 5.66M12 8v4l2.5 2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            Ciclo contínuo
          </div>
        ) : null}
      </div>
    </article>
  );
}

function MetodoMobile() {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: "-4% 0px" });

  return (
    <div ref={ref} className="relative mt-14 lg:hidden">
      <div aria-hidden className="absolute top-6 bottom-6 left-6 w-px overflow-hidden">
        <div
          className={cn(
            "h-full w-full origin-top bg-gradient-to-b from-[#006CFF] via-[#00D8FF] to-[#9DFF2F] transition-transform duration-[1.6s] ease-out",
            inView ? "scale-y-100" : "scale-y-0",
          )}
        />
      </div>

      <div className="relative flex flex-col gap-8">
        {STEPS.map((step, i) => (
          <MetodoStep key={step.n} mobile step={step} index={i} isLast={i === STEPS.length - 1} />
        ))}
      </div>
    </div>
  );
}

export function Metodo() {
  const { ref: lineRef, inView: lineInView } = useInView({ threshold: 0.15, rootMargin: "-5% 0px" });

  return (
    <section id="metodo" className="relative isolate overflow-hidden border-t border-white/5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-[#006CFF]/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#9DFF2F]/[0.05] blur-3xl"
        aria-hidden
      />

      <p
        className="pointer-events-none absolute right-6 top-16 select-none text-[clamp(3.5rem,12vw,8rem)] font-black uppercase leading-none tracking-tighter text-white/[0.03] lg:right-12"
        aria-hidden
      >
        método
      </p>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F]" />
              Nosso método
            </div>
            <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">
              Planejar. Executar. Analisar. <span className="text-gradient-brand">Crescer.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 lg:max-w-xs lg:justify-end">
            {VERBS.map((verb, i) => (
              <span key={verb} className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gradient-brand">{verb}</span>
                {i < VERBS.length - 1 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="text-white/20">
                    <path
                      d="m9 6 6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
            ))}
          </div>
        </div>

        <div ref={lineRef} className="relative mt-14 hidden lg:mt-16 lg:block">
          <div
            aria-hidden
            className={cn(
              "absolute left-[12.5%] right-[12.5%] top-7 h-px origin-left bg-gradient-to-r from-[#006CFF] via-[#00D8FF] to-[#9DFF2F] transition-transform duration-[1.2s] ease-out",
              lineInView ? "scale-x-100" : "scale-x-0",
            )}
          />
          <div className="grid grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <MetodoStep key={step.n} step={step} index={i} isLast={i === STEPS.length - 1} />
            ))}
          </div>
        </div>

        <MetodoMobile />
      </div>
    </section>
  );
}
