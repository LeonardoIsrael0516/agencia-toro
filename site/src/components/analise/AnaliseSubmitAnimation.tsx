import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Enviando sua solicitação...",
  "Preparando sua análise...",
  "Conectando você com a Toró...",
] as const;

const DURATION_MS = 3000;

type AnaliseSubmitAnimationProps = {
  onComplete: () => void;
};

export function AnaliseSubmitAnimation({ onComplete }: AnaliseSubmitAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const msgId = window.setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 900);

    const checkId = window.setTimeout(() => setShowCheck(true), 1800);
    const doneId = window.setTimeout(onComplete, DURATION_MS);

    return () => {
      window.clearInterval(msgId);
      window.clearTimeout(checkId);
      window.clearTimeout(doneId);
    };
  }, [onComplete]);

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-8 sm:py-12"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_40%,rgba(0,108,255,0.08),transparent)]"
        aria-hidden
      />

      {/* Chuva decorativa */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="analise-submit-rain absolute top-0 h-4 w-px bg-gradient-to-b from-[#00D8FF]/0 via-[#00D8FF]/50 to-[#006CFF]/0"
            style={{
              left: `${6 + i * 6.5}%`,
              animationDelay: `${(i * 0.18) % 1.2}s`,
              animationDuration: `${0.9 + (i % 4) * 0.15}s`,
            }}
          />
        ))}
      </div>

      <div className="relative grid place-items-center">
        <div
          className="absolute h-28 w-28 rounded-full bg-[#006CFF]/10 blur-2xl animate-pulse-glow sm:h-32 sm:w-32"
          aria-hidden
        />
        <div
          className="absolute h-36 w-36 rounded-full border border-[#006CFF]/10 sm:h-40 sm:w-40"
          aria-hidden
        />
        <div className="analise-submit-ring absolute h-32 w-32 rounded-full sm:h-36 sm:w-36" aria-hidden />

        <div
          className={cn(
            "relative grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_20px_60px_-24px_rgba(0,108,255,0.45)] sm:h-28 sm:w-28",
            showCheck && "analise-submit-pop",
          )}
        >
          {showCheck ? (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              aria-hidden
              className="analise-submit-check text-[#006CFF]"
            >
              <path
                d="M5 12.5 9.5 17 19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden className="text-[#006CFF]">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
            </svg>
          )}
        </div>
      </div>

      <p className="mt-10 text-center text-sm font-semibold tracking-tight text-[var(--ink)] sm:text-base">
        {MESSAGES[messageIndex]}
      </p>

      <div className="mt-5 flex gap-1.5" aria-hidden>
        {MESSAGES.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i <= messageIndex ? "w-6 bg-gradient-brand" : "w-1.5 bg-[var(--ink)]/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export const ANALISE_SUBMIT_ANIMATION_MS = DURATION_MS;
