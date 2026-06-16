import { Link } from "@tanstack/react-router";
import heroBg from "@/assets/hero.png";
import { ScrollDownCue } from "@/components/ScrollDownCue";

export function Hero() {
  return (
    <section className="hero-storm relative isolate flex min-h-[88svh] items-center overflow-hidden pt-24 pb-16">
      <div className="hero-lightning absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          width={1600}
          height={900}
          className="hero-sky-image h-full w-full object-cover object-center opacity-55"
        />
        <div className="hero-sky-vignette absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,transparent,var(--ink)_75%)]" />
        <div className="hero-sky-clear" aria-hidden />
        <div className="absolute -left-32 top-1/3 h-[360px] w-[360px] rounded-full bg-[#006CFF]/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute -right-32 top-1/2 h-[360px] w-[360px] rounded-full bg-[#9DFF2F]/10 blur-[140px]" />
      </div>

      <div className="hero-rain" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9DFF2F] animate-pulse-glow" />
          Especialistas em marketing para clínicas de saúde e estética.
        </div>

        <h1 className="mt-6 max-w-[22ch] text-balance text-[clamp(2.25rem,5.5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          Marketing que faz <span className="text-gradient-brand">chover</span> resultados.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
        Transformamos estratégia em crescimento.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/analise"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-[#031225] shadow-[0_16px_48px_-16px_rgba(0,108,255,0.6)] transition hover:scale-[1.02] sm:px-7 sm:py-4 sm:text-base"
          >
            Solicitar análise gratuita
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#031225] text-foreground transition group-hover:rotate-[-45deg]">
              →
            </span>
          </Link>
          <a
            href="#na-pratica"
            className="text-sm text-foreground/55 underline-offset-4 transition hover:text-foreground/80 hover:underline"
          >
            Ver na prática
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center lg:hidden">
        <ScrollDownCue targetId="sobre" className="pointer-events-auto" />
      </div>
    </section>
  );
}
