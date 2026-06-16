import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export type Servico = {
  n: string;
  t: string;
  d: string;
  items: readonly string[];
};

export function ServicoCard({ servico }: { servico: Servico }) {
  const { ref, inView } = useInView();
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const active = !canHover && inView;

  return (
    <article
      ref={ref}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden bg-white p-8 transition-colors duration-500",
        "hover:bg-[#eef1f6]",
        active && "bg-[#eef1f6]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
          "bg-gradient-to-br from-[#006CFF]/[0.07] via-transparent to-[#9DFF2F]/[0.09]",
          "group-hover:opacity-100",
          active && "opacity-100",
        )}
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-[var(--ink)]/45">{servico.n}</span>
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full border border-[var(--ink)]/10 text-[var(--ink)]/55 transition duration-300",
            "group-hover:border-[#006CFF] group-hover:text-[#006CFF]",
            active && "border-[#006CFF] text-[#006CFF]",
          )}
        >
          →
        </span>
      </div>

      <div className="relative mt-8 flex flex-1 flex-col">
        <h3 className="text-xl font-semibold leading-tight text-[var(--ink)]">{servico.t}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/60">{servico.d}</p>
        <ul className="mt-5 space-y-2 border-t border-[var(--ink)]/8 pt-5">
          {servico.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ink)]/55">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gradient-brand" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-brand transition-transform duration-500",
          "group-hover:scale-x-100",
          active && "scale-x-100",
        )}
      />
    </article>
  );
}
