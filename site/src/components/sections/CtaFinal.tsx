import { Link } from "@tanstack/react-router";

export function CtaFinal() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#006CFF]/35 via-[#00D8FF]/15 to-[#9DFF2F]/25 p-px">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-[var(--ink-2)] p-10 md:p-14 lg:p-16">
          <div className="cta-storm" aria-hidden>
            <div className="cta-lightning" />
            <div className="cta-lightning-streak" />
            <div className="cta-rain" />
            <svg
              className="cta-lightning-bolt cta-lightning-bolt--a"
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
            </svg>
            <svg
              className="cta-lightning-bolt cta-lightning-bolt--b"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
            </svg>
          </div>
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#006CFF]/35 blur-[140px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#9DFF2F]/15 blur-[160px]"
            aria-hidden
          />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F] animate-pulse-glow" />
                Próximo passo
              </div>

              <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2rem,5vw,4.25rem)] font-black leading-[0.98] tracking-tight">
                Pronto para fazer{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-brand">chover clientes</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="absolute -right-5 -top-1 text-[#9DFF2F] sm:-right-6 sm:-top-0.5"
                  >
                    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
                  </svg>
                </span>{" "}
                no seu negócio?
              </h2>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
                Solicite uma análise gratuita. Em até 24h apresentamos oportunidades reais para o seu negócio crescer.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00D8FF]" />
                Resposta em até 24h
              </span>

              <Link
                to="/analise"
                className="group inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full bg-gradient-brand px-4 py-3 text-[13px] font-semibold text-[#031225] shadow-[0_30px_80px_-20px_rgba(0,108,255,0.7)] transition hover:scale-[1.02] sm:gap-3 sm:px-7 sm:py-4 sm:text-base"
              >
                Quero minha análise gratuita
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#031225] text-sm text-foreground transition duration-300 group-hover:rotate-[-45deg] sm:h-7 sm:w-7">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
