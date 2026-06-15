import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const nav = [
  { label: "Quem somos", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Para quem", href: "#para-quem" },
  { label: "Cases", href: "#cases" },
  { label: "Método", href: "#metodo" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-white/5" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-foreground/70 transition hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/analise"
            className="group relative hidden overflow-hidden rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-[#031225] shadow-[0_8px_30px_-10px_rgba(0,108,255,0.6)] transition hover:scale-[1.02] sm:inline-flex"
          >
            Análise gratuita
            <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-foreground transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-foreground transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/5 bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-6 py-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-foreground/80 hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/analise"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gradient-brand px-5 py-3 text-center text-sm font-semibold text-[#031225]"
            >
              Análise gratuita
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
