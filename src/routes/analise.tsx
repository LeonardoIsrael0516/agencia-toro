import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/analise")({
  head: () => ({
    meta: [
      { title: "Análise gratuita — Toró Marketing" },
      {
        name: "description",
        content:
          "Preencha o formulário e nossa equipe fará uma análise inicial do seu marketing, presença digital e potencial de crescimento. Resposta em até 24h.",
      },
      { property: "og:title", content: "Solicite uma análise gratuita — Toró" },
      {
        property: "og:description",
        content:
          "Análise estratégica gratuita para clínicas e profissionais de saúde. Identifique oportunidades de crescimento em 24h.",
      },
    ],
  }),
  component: AnalisePage,
});

const faixas = [
  "Até R$ 10 mil",
  "De R$ 10 mil a R$ 30 mil",
  "De R$ 30 mil a R$ 50 mil",
  "De R$ 50 mil a R$ 100 mil",
  "Acima de R$ 100 mil",
];

const desafios = [
  "Conseguir mais pacientes/clientes",
  "Aumentar as vendas",
  "Melhorar o posicionamento da marca",
  "Estruturar a equipe comercial",
  "Melhorar os resultados do tráfego pago",
  "Outro",
];

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo").max(120),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  empresa: z.string().trim().min(2, "Informe o nome da empresa").max(120),
  segmento: z.string().trim().min(2, "Informe o segmento").max(80),
  instagram: z.string().trim().max(60).optional().or(z.literal("")),
  faturamento: z.string().min(1, "Selecione uma faixa"),
  desafio: z.string().min(1, "Selecione um desafio"),
});

type FormData = z.infer<typeof schema>;
type Step = 0 | 1 | 2;

const steps = [
  { label: "Sobre você", fields: ["nome", "whatsapp"] as const },
  { label: "Sobre o negócio", fields: ["empresa", "segmento", "instagram"] as const },
  { label: "Momento atual", fields: ["faturamento", "desafio"] as const },
] as const;

function AnalisePage() {
  const [step, setStep] = useState<Step>(0);
  const [data, setData] = useState<FormData>({
    nome: "",
    whatsapp: "",
    empresa: "",
    segmento: "",
    instagram: "",
    faturamento: "",
    desafio: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => ((step + (submitted ? 1 : 0)) / steps.length) * 100, [step, submitted]);

  function update<K extends keyof FormData>(k: K, v: FormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function next() {
    const fields = steps[step].fields;
    const partial = Object.fromEntries(fields.map((f) => [f, data[f]])) as Partial<FormData>;
    const partialSchema = schema.pick(Object.fromEntries(fields.map((f) => [f, true])) as never);
    const r = partialSchema.safeParse(partial);
    if (!r.success) {
      const errs: Partial<Record<keyof FormData, string>> = {};
      for (const issue of r.error.issues) {
        const k = issue.path[0] as keyof FormData;
        errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    if (step < steps.length - 1) setStep((s) => (s + 1) as Step);
    else submit();
  }

  function submit() {
    const r = schema.safeParse(data);
    if (!r.success) return;
    // No backend wired yet — show success state.
    setSubmitted(true);
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-[var(--ink)] text-foreground">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#006CFF]/25 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 -z-0 h-[480px] w-[480px] rounded-full bg-[#9DFF2F]/15 blur-[160px]" />

      <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">
        <Logo />
        <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
          ← Voltar ao site
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1400px] gap-12 px-6 py-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-10 lg:py-16">
        {/* ---------------------- LEFT ---------------------- */}
        <aside className="relative">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9DFF2F] animate-pulse-glow" />
            Análise gratuita · resposta em 24h
          </div>
          <h1 className="mt-8 text-balance text-[clamp(2.2rem,5vw,4.4rem)] font-black leading-[0.95] tracking-tight">
            Solicite uma <span className="text-gradient-brand">análise gratuita</span> do seu marketing.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/75">
            Preencha os dados abaixo e nossa equipe fará uma análise inicial do seu marketing, presença digital e
            potencial de crescimento. Em até 24 horas entraremos em contato com oportunidades de melhoria e estratégias
            personalizadas para o seu negócio.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              "Diagnóstico completo do seu funil de captação",
              "Análise de concorrência regional do seu segmento",
              "Plano inicial de crescimento — sem compromisso",
            ].map((t) => (
              <li key={t} className="flex items-start gap-4">
                <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-brand text-[10px] font-bold text-[#031225]">✓</span>
                <span className="text-foreground/85">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 hidden rounded-3xl border border-white/8 bg-[var(--ink-2)]/70 p-6 lg:block">
            <p className="text-sm text-foreground/70">
              <span className="text-foreground">+200 clínicas atendidas</span> em medicina, odontologia, estética,
              dermatologia, nutrição e bem-estar.
            </p>
          </div>
        </aside>

        {/* ---------------------- FORM ---------------------- */}
        <section className="relative">
          <div className="absolute -inset-px -z-10 rounded-[2rem] bg-gradient-brand opacity-40 blur-2xl" />
          <div className="rounded-[1.8rem] border border-white/10 bg-[var(--ink-2)]/90 p-7 backdrop-blur-xl md:p-10">
            {/* progress */}
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span>{submitted ? "Pronto" : `Passo ${step + 1} de ${steps.length}`}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-brand transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {submitted ? (
              <SuccessState data={data} />
            ) : (
              <div className="mt-10 space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">{steps[step].label}</h2>

                {step === 0 && (
                  <>
                    <Field label="Nome completo" error={errors.nome}>
                      <input
                        value={data.nome}
                        onChange={(e) => update("nome", e.target.value)}
                        placeholder="Como podemos te chamar?"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="WhatsApp" error={errors.whatsapp}>
                      <input
                        value={data.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        placeholder="(11) 99999-9999"
                        inputMode="tel"
                        className={inputCls}
                      />
                    </Field>
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field label="Nome da empresa" error={errors.empresa}>
                      <input
                        value={data.empresa}
                        onChange={(e) => update("empresa", e.target.value)}
                        placeholder="Sua clínica ou consultório"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Segmento" error={errors.segmento}>
                      <input
                        value={data.segmento}
                        onChange={(e) => update("segmento", e.target.value)}
                        placeholder="Ex: Odontologia, dermatologia, estética…"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Instagram da empresa" error={errors.instagram} hint="Opcional">
                      <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 focus-within:border-[#00D8FF]/60">
                        <span className="px-4 text-foreground/60">@</span>
                        <input
                          value={data.instagram}
                          onChange={(e) => update("instagram", e.target.value.replace(/^@/, ""))}
                          placeholder="suaclinica"
                          className="w-full bg-transparent py-4 pr-4 text-foreground outline-none placeholder:text-foreground/40"
                        />
                      </div>
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="Faturamento mensal aproximado" error={errors.faturamento}>
                      <div className="grid gap-2">
                        {faixas.map((f) => (
                          <Choice
                            key={f}
                            label={f}
                            checked={data.faturamento === f}
                            onClick={() => update("faturamento", f)}
                          />
                        ))}
                      </div>
                    </Field>
                    <Field label="Qual seu principal desafio hoje?" error={errors.desafio}>
                      <div className="grid gap-2">
                        {desafios.map((d) => (
                          <Choice
                            key={d}
                            label={d}
                            checked={data.desafio === d}
                            onClick={() => update("desafio", d)}
                          />
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => step > 0 && setStep((s) => (s - 1) as Step)}
                    disabled={step === 0}
                    className="text-sm text-foreground/60 transition hover:text-foreground disabled:opacity-30"
                  >
                    ← Voltar
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-brand px-7 py-4 text-base font-semibold text-[#031225] shadow-[0_20px_60px_-20px_rgba(0,108,255,0.7)] transition hover:scale-[1.02]"
                  >
                    {step === steps.length - 1 ? "Quero receber minha análise gratuita" : "Continuar"}
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#031225] text-foreground">→</span>
                  </button>
                </div>

                <p className="pt-4 text-center text-[11px] text-muted-foreground">
                  Seus dados estão seguros. Não enviamos spam — só estratégia.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-foreground outline-none transition placeholder:text-foreground/40 focus:border-[#00D8FF]/60 focus:bg-white/[0.07]";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/70">{label}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-2 text-xs text-[#FF8FA3]">{error}</p>}
    </label>
  );
}

function Choice({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition ${
        checked
          ? "border-[#9DFF2F]/70 bg-[#9DFF2F]/10 text-foreground"
          : "border-white/10 bg-white/[0.03] text-foreground/80 hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`grid h-5 w-5 place-items-center rounded-full border ${
          checked ? "border-[#9DFF2F] bg-[#9DFF2F] text-[#031225]" : "border-white/20"
        }`}
      >
        {checked && <span className="text-[10px] font-bold">✓</span>}
      </span>
    </button>
  );
}

function SuccessState({ data }: { data: FormData }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-brand text-3xl text-[#031225]">
        ✓
      </div>
      <h2 className="mt-8 text-3xl font-bold tracking-tight">Recebemos sua solicitação, {data.nome.split(" ")[0]}!</h2>
      <p className="mx-auto mt-4 max-w-md text-foreground/75">
        Em até 24 horas nossa equipe entrará em contato no WhatsApp <span className="text-foreground">{data.whatsapp}</span> com
        a análise inicial do marketing da <span className="text-foreground">{data.empresa}</span>.
      </p>
      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-foreground/85 hover:bg-white/5"
      >
        ← Voltar para o site
      </Link>
    </div>
  );
}