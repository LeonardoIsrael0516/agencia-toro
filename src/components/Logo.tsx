import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** dark = fundo escuro (logo branca) · light = fundo claro (logo padrão) */
  theme?: "dark" | "light";
};

const sizes = {
  sm: "h-7 sm:h-8",
  md: "h-8 sm:h-9 lg:h-10",
  lg: "h-9 sm:h-10 lg:h-11",
};

export function Logo({ className = "", size = "md", theme = "dark" }: LogoProps) {
  const sizeClass = sizes[size];

  return (
    <Link
      to="/"
      className={cn("group relative inline-flex shrink-0 items-center", className)}
      aria-label="Toró, início"
    >
      <span className={cn("relative block w-[9.5rem] max-w-[42vw]", sizeClass)}>
        <img
          src={logoWhite}
          alt=""
          width={180}
          height={48}
          decoding="async"
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500 group-hover:opacity-90",
            theme === "dark" ? "opacity-100" : "opacity-0",
          )}
        />
        <img
          src={logo}
          alt="Toró Marketing"
          width={180}
          height={48}
          decoding="async"
          className={cn(
            "h-full w-full object-contain object-left transition-opacity duration-500 group-hover:opacity-90",
            theme === "light" ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </Link>
  );
}
