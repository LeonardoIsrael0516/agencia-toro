import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="Toró — início">
      <span className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-gradient-brand opacity-90 blur-[6px] transition group-hover:opacity-100" />
        <svg viewBox="0 0 40 40" className="relative h-9 w-9" aria-hidden="true">
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#006CFF" />
              <stop offset="55%" stopColor="#00D8FF" />
              <stop offset="100%" stopColor="#9DFF2F" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="19" fill="#031225" />
          <path
            d="M11 13 H29 M20 13 V29 C20 29 16 28 14.5 24.5"
            stroke="url(#tg)"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight">toró</span>
        <span className="text-[9px] font-medium tracking-[0.32em] text-muted-foreground">MARKETING</span>
      </span>
    </Link>
  );
}
