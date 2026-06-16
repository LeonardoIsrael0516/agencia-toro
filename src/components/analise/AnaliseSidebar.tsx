import formBg from "@/assets/form.jpg";

const BENEFICIOS = [
  "Diagnóstico do seu funil de captação",
  "Análise de presença digital e concorrência",
  "Direcionamento estratégico, sem compromisso",
];

export function AnaliseSidebar() {
  return (
    <aside className="relative hidden overflow-hidden bg-[var(--ink)] text-foreground lg:flex lg:flex-col lg:p-10 xl:p-12">
      <img
        src={formBg}
        alt=""
        className="pointer-events-none absolute left-1/2 top-0 h-[128%] w-[118%] max-w-none -translate-x-1/2 -translate-y-[22%] object-cover object-[center_12%]"
        aria-hidden
      />

      {/* Degradê escuro de baixo pra cima — estilo V4 */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink)] from-0% via-[var(--ink)]/90 via-[48%] to-transparent to-100%"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031225]/95 from-0% via-transparent via-[60%] to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col gap-10">
        <div className="flex-1" aria-hidden />

        <div>
          <h1 className="text-balance text-[clamp(1.75rem,3vw,3rem)] font-black leading-[0.98] tracking-tight">
            Solicite uma <span className="text-gradient-brand">análise gratuita</span> do seu marketing.
          </h1>
        </div>

        <ul className="space-y-3">
          {BENEFICIOS.map((t) => (
            <li key={t} className="flex items-start gap-3 text-sm text-foreground/90">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-brand text-[9px] font-bold text-[#031225]">
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
