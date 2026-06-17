import { cn } from "@/lib/utils";

type ScrollDownCueProps = {
  targetId: string;
  className?: string;
};

export function ScrollDownCue({ targetId, className }: ScrollDownCueProps) {
  function scrollToNext() {
    const el = document.getElementById(targetId);
    if (!el) return;

    const headerOffset = 88;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToNext}
      aria-label="Ir para a próxima seção"
      className={cn(
        "scroll-down-cue grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-[var(--ink)]/45 text-foreground/65 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.65)] backdrop-blur-md transition hover:border-white/22 hover:bg-white/10 hover:text-foreground active:scale-95",
        className,
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
