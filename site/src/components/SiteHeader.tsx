import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useOverLightSection } from "@/hooks/use-over-light-section";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Quem somos", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Para quem", href: "#para-quem" },
  { label: "Na prática", href: "#na-pratica" },
  { label: "Método", href: "#metodo" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overLight = useOverLightSection();
  const light = overLight;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      if (window.scrollY > 16) setOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const showBar = scrolled || light;

  return (
    <header
      data-site-header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        !showBar && "bg-transparent",
        showBar && !light && "border-b border-white/[0.06] bg-background/75 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] backdrop-blur-2xl",
        showBar &&
          light &&
          "border-b border-[var(--ink)]/10 bg-[var(--paper)]/88 shadow-[0_8px_30px_-10px_rgba(3,18,37,0.1)] backdrop-blur-2xl",
      )}
    >
      {light && showBar && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-brand opacity-80"
          aria-hidden
        />
      )}

      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-3.5 lg:px-10 lg:py-4">
        <Logo size="md" theme={light ? "light" : "dark"} />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navegação principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "group relative rounded-full px-4 py-2 text-sm transition-colors",
                light ? "text-[var(--ink)]/60 hover:text-[var(--ink)]" : "text-foreground/65 hover:text-foreground",
              )}
            >
              {item.label}
              <span className="absolute inset-x-4 -bottom-px h-px origin-center scale-x-0 bg-gradient-brand transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            to="/analise"
            className="group relative hidden items-center overflow-hidden rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-[#031225] shadow-[0_8px_30px_-10px_rgba(0,108,255,0.55)] transition hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_rgba(0,108,255,0.65)] sm:inline-flex"
          >
            Análise gratuita
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden",
              light
                ? open
                  ? "border-[#006CFF]/30 bg-[var(--ink)]/5"
                  : "border-[var(--ink)]/15 hover:border-[var(--ink)]/25 hover:bg-[var(--ink)]/5"
                : open
                  ? "border-[#9DFF2F]/30 bg-white/5"
                  : "border-white/10 hover:border-white/20 hover:bg-white/5",
            )}
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-5 rounded-full transition-all duration-300",
                  light ? "bg-[var(--ink)]" : "bg-foreground",
                  open && "translate-y-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full transition-all duration-300",
                  light ? "bg-[var(--ink)]" : "bg-foreground",
                  open && "scale-x-0 opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-5 rounded-full transition-all duration-300",
                  light ? "bg-[var(--ink)]" : "bg-foreground",
                  open && "-translate-y-1 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden backdrop-blur-2xl transition-all duration-300 lg:hidden",
          light ? "border-t border-[var(--ink)]/10 bg-[var(--paper)]/95" : "border-t border-white/5 bg-background/95",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-6 py-4" aria-label="Navegação mobile">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-xl px-3 py-3 text-base transition",
                light
                  ? "text-[var(--ink)]/80 hover:bg-[var(--ink)]/5 hover:text-[var(--ink)]"
                  : "text-foreground/80 hover:bg-white/5 hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/analise"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-gradient-brand px-5 py-3.5 text-center text-sm font-semibold text-[#031225]"
          >
            Análise gratuita →
          </Link>
        </nav>
      </div>
    </header>
  );
}
