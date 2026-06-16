import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

type AnaliseFormChromeProps = {
  step: number;
  totalSteps: number;
  submitted: boolean;
  submitting?: boolean;
  onBack: () => void;
  canGoBack: boolean;
  children: React.ReactNode;
};

export function AnaliseFormChrome({
  step,
  totalSteps,
  submitted,
  submitting = false,
  onBack,
  canGoBack,
  children,
}: AnaliseFormChromeProps) {
  const finished = submitted || submitting;
  const progress = finished ? 100 : ((step + 1) / totalSteps) * 100;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--paper)] text-[var(--ink)] lg:min-h-0 lg:h-auto lg:overflow-visible">
      <div className="relative shrink-0 px-5 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pt-8">
        <div className="flex items-center justify-between">
          {canGoBack && !finished ? (
            <button
              type="button"
              onClick={onBack}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--ink)]/10 text-[var(--ink)]/55 transition hover:border-[var(--ink)]/20 hover:bg-[var(--ink)]/[0.03] hover:text-[var(--ink)]"
              aria-label="Voltar"
            >
              ←
            </button>
          ) : (
            <Link
              to="/"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--ink)]/10 text-[var(--ink)]/55 transition hover:border-[var(--ink)]/20 hover:bg-[var(--ink)]/[0.03] hover:text-[var(--ink)]"
              aria-label="Voltar ao site"
            >
              ←
            </Link>
          )}
          <Logo theme="light" size="sm" className="absolute left-1/2 -translate-x-1/2" />
          <span className="w-10" aria-hidden />
        </div>

        {!finished ? (
          <div className="mt-4 lg:mt-6">
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--ink)]/40">
              <span>
                {submitting ? "Finalizando" : `Passo ${step + 1} de ${totalSteps}`}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--ink)]/[0.06]">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r from-[#006CFF] via-[#00D8FF] to-[#9DFF2F] transition-[width] duration-500",
                  submitting && "animate-pulse",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden px-5 pb-4 sm:px-8 sm:pb-10 lg:overflow-visible lg:px-10 lg:pb-10">
        {children}
      </div>

      <footer className="shrink-0 border-t border-[var(--ink)]/8 px-5 py-3 text-center sm:px-8 lg:px-10 lg:py-5">
        <p className="text-[11px] leading-relaxed text-[var(--ink)]/45">
          Seus dados estão seguros. Não enviamos spam, só estratégia.
        </p>
        <Link to="/" className="mt-1 inline-block text-[11px] text-[var(--ink)]/55 underline-offset-2 hover:underline lg:mt-2">
          Voltar ao site
        </Link>
      </footer>
    </div>
  );
}
