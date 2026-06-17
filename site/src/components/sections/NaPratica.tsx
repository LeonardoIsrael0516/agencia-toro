import { useEffect, useRef } from "react";
import { ReelsPlayer } from "./na-pratica/ReelsPlayer";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const CENARIOS = [
  {
    problema: "Instagram bonito, agenda vazia",
    solucao: "Funil, tráfego e criativos focados em agendamento",
  },
  {
    problema: "Leads chegam, equipe não converte",
    solucao: "Scripts, follow-up e treinamento comercial",
  },
  {
    problema: "Marketing sem clareza de retorno",
    solucao: "Dashboards e reuniões mensais de performance",
  },
] as const;

function CenarioRow({
  problema,
  solucao,
  index,
  isLast,
}: {
  problema: string;
  solucao: string;
  index: number;
  isLast: boolean;
}) {
  const { ref, inView } = useInView({ threshold: 0.35 });

  return (
    <li
      ref={ref}
      className={cn(
        "flex gap-3 transition duration-500",
        inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <span className="w-5 shrink-0 pt-0.5 font-mono text-[10px] tabular-nums text-[#00D8FF]/65">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={cn("min-w-0 flex-1", !isLast && "border-b border-white/[0.06] pb-3.5")}>
        <p className="text-[13px] font-medium leading-snug text-foreground/90">{problema}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-foreground/45">{solucao}</p>
      </div>
    </li>
  );
}

export function NaPratica() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const mq = window.matchMedia("(max-width: 1023px)");
    if (!section || !mq.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("reels-immersive", entry.isIntersecting && entry.intersectionRatio >= 0.55);
      },
      { threshold: [0, 0.35, 0.55, 0.75, 1] },
    );

    observer.observe(section);

    const onChange = () => {
      if (!mq.matches) document.body.classList.remove("reels-immersive");
    };
    mq.addEventListener("change", onChange);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", onChange);
      document.body.classList.remove("reels-immersive");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="na-pratica"
      className={cn(
        "relative overflow-hidden bg-black",
        "h-[100svh] snap-section-reels touch-pan-y lg:h-auto lg:snap-none",
        "lg:border-y lg:border-white/5 lg:bg-[var(--ink)]",
      )}
    >
      {/* Mobile — Reels em tela cheia */}
      <div className="absolute inset-0 touch-pan-y lg:hidden">
        <ReelsPlayer variant="mobile" fullscreen />
      </div>

      {/* Desktop */}
      <div className="relative z-10 hidden lg:block">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,108,255,0.06)_0%,transparent_42%,rgba(157,255,47,0.04)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:64px_64px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-[#006CFF]/[0.08] blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-1/4 h-[360px] w-[360px] rounded-full bg-[#9DFF2F]/[0.06] blur-[100px]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-[1400px] px-10 py-14 xl:px-12 xl:py-16">
          <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-10 2xl:gap-14">
            {/* Coluna esquerda */}
            <div className="flex flex-col justify-center xl:pr-2">
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F]" />
                Na prática
              </div>

              <h2 className="mt-5 text-balance text-[clamp(2rem,3.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
                Do diagnóstico à escala,{" "}
                <span className="text-gradient-brand">cada etapa</span> tem propósito.
              </h2>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/55">
                Conteúdo vertical, direto e alinhado ao que funciona hoje para clínicas e estética.
              </p>

              <ol className="mt-6 max-w-md">
                {CENARIOS.map((cenario, i) => (
                  <CenarioRow
                    key={cenario.problema}
                    problema={cenario.problema}
                    solucao={cenario.solucao}
                    index={i}
                    isLast={i === CENARIOS.length - 1}
                  />
                ))}
              </ol>
            </div>

            {/* Coluna direita — Reels */}
            <div className="relative flex justify-center xl:justify-end">
              <div
                className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#006CFF]/20 via-transparent to-[#9DFF2F]/15 blur-2xl"
                aria-hidden
              />

              <div className="relative -rotate-[2deg] transition duration-700 hover:rotate-0">
                <div
                  className="pointer-events-none absolute -inset-4 rounded-[2.75rem] border border-white/[0.08]"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -left-14 top-1/2 hidden -translate-y-1/2 xl:block"
                  aria-hidden
                >
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-foreground/45">
                      Diagnóstico
                    </span>
                    <span className="h-8 w-px bg-gradient-to-b from-[#006CFF]/50 to-transparent" />
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-foreground/45">
                      Estratégia
                    </span>
                    <span className="h-8 w-px bg-gradient-to-b from-[#00D8FF]/50 to-transparent" />
                    <span className="rounded-full border border-[#9DFF2F]/25 bg-[#9DFF2F]/[0.06] px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#9DFF2F]/80">
                      Execução
                    </span>
                  </div>
                </div>

                <ReelsPlayer variant="desktop" className="relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
