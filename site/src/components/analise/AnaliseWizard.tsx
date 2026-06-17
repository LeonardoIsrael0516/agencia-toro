import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  ANALISE_STEPS,
  analiseSchema,
  DESAFIO_OUTRO,
  EMPTY_FORM,
  ENTREGAVEIS,
  TOTAL_STEPS,
  validateStep,
  type AnaliseFormData,
  type StepField,
} from "./analise-config";
import { AnaliseFormChrome } from "./AnaliseFormChrome";
import { AnaliseSubmitAnimation } from "./AnaliseSubmitAnimation";
import { Checkbox } from "@/components/ui/checkbox";
<<<<<<< HEAD
import { useMobileKeyboardInset } from "@/hooks/use-mobile-keyboard-inset";
import { submitLeadFromClient } from "@/lib/api/submit-lead-client";
=======
import { submitLead } from "@/lib/api/submit-lead";
>>>>>>> parent of 58178fa (2)
import { LEGAL } from "@/lib/legal-config";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-[var(--ink)]/12 bg-white px-4 py-3.5 text-base text-[var(--ink)] outline-none transition placeholder:text-[var(--ink)]/35 focus:border-[#006CFF]/50 focus:ring-2 focus:ring-[#006CFF]/15 lg:py-4";

export function AnaliseWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AnaliseFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<StepField | "consentimentoPrivacidade", string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const current = ANALISE_STEPS[step];
  const isLast = step === TOTAL_STEPS - 1;
  const currentValue = data[current.field];
  const shouldAutoFocus =
    current.type !== "radio" &&
    (typeof currentValue !== "string" || currentValue.trim().length === 0);

  function update<K extends StepField>(k: K, v: AnaliseFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  const next = useCallback(() => {
    if (submitted || submitting) return;

    const result = validateStep(step, data);
    if (!result.success) {
      const errs: Partial<Record<StepField | "consentimentoPrivacidade", string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as StepField | "consentimentoPrivacidade";
        errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }

    if (isLast) {
      const full = analiseSchema.safeParse(data);
      if (!full.success) {
        const errs: Partial<Record<StepField | "consentimentoPrivacidade", string>> = {};
        for (const issue of full.error.issues) {
          const k = issue.path[0] as StepField | "consentimentoPrivacidade";
          errs[k] = issue.message;
        }
        setErrors(errs);
        return;
      }
      // Envia para API durante a animação de submit
      setSubmitError(null);
      setSubmitSucceeded(false);
      setAnimationDone(false);
      setSubmitting(true);

      const consentedAt = new Date().toISOString();
      void submitLeadFromClient({
        nome: full.data.nome,
        whatsapp: full.data.whatsapp,
        empresa: full.data.empresa,
        segmento: full.data.segmento,
        instagram: full.data.instagram,
        faturamento: full.data.faturamento,
        desafio: full.data.desafio,
        desafioOutro: full.data.desafioOutro,
        privacyPolicyVersion: LEGAL.privacyPolicyVersion,
        consentedAt,
      })
        .then(() => setSubmitSucceeded(true))
        .catch((err: unknown) => {
          setSubmitting(false);
          const raw = err instanceof Error ? err.message : String(err);
          const friendly =
            raw.includes("<!doctype html>") || raw.includes("This page didn't load")
              ? "Não foi possível enviar sua solicitação. Tente novamente em instantes."
              : raw || "Não foi possível enviar sua solicitação. Tente novamente.";
          setSubmitError(friendly);
        });
      return;
    }

    setStep((s) => s + 1);
    setAnimKey((k) => k + 1);
  }, [step, data, isLast, submitted, submitting]);

  const handleSubmitComplete = useCallback(() => {
    setAnimationDone(true);
  }, []);

  useEffect(() => {
    if (animationDone && submitSucceeded) {
      setSubmitting(false);
      setSubmitted(true);
    }
  }, [animationDone, submitSucceeded]);

  const back = useCallback(() => {
    if (step > 0 && !submitted && !submitting) {
      setStep((s) => s - 1);
      setErrors({});
    }
  }, [step, submitted, submitting]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && !submitted && !submitting && current.type !== "radio") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, submitted, submitting, current.type]);

  return (
    <AnaliseFormChrome
      step={step}
      totalSteps={TOTAL_STEPS}
      submitted={submitted}
      submitting={submitting}
      onBack={back}
      canGoBack={step > 0 && !submitting}
    >
      {submitted ? (
        <SuccessState data={data} />
      ) : submitting ? (
        <AnaliseSubmitAnimation onComplete={handleSubmitComplete} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
          <div
            key={animKey}
            className="flex min-h-0 flex-1 flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="min-h-0 flex-1 py-3 sm:py-10">
              {current.greeting ? (
                <p className="text-sm text-[var(--ink)]/45">{current.greeting}</p>
              ) : null}
              <h2 className="mt-1.5 text-balance text-xl font-bold tracking-tight text-[var(--ink)] sm:mt-2 sm:text-3xl">
                {current.question}
              </h2>

              <div className="mt-5 w-full sm:mt-8">
                {current.type === "text" || current.type === "tel" ? (
                  <Field error={errors[current.field]} hint={current.hint}>
                    <input
                      type="text"
                      value={data[current.field] as string}
                      onChange={(e) => update(current.field, e.target.value)}
                      placeholder={current.placeholder}
                      inputMode={current.type === "tel" ? "numeric" : undefined}
                      pattern={current.type === "tel" ? "[0-9]*" : undefined}
                      autoComplete={current.type === "tel" ? "tel" : undefined}
                      autoFocus={shouldAutoFocus}
                      className={inputCls}
                    />
                  </Field>
                ) : null}

                {current.type === "instagram" ? (
                  <Field error={errors[current.field]} hint={current.hint}>
                    <div className="flex w-full items-center overflow-hidden rounded-xl border border-[var(--ink)]/12 bg-white focus-within:border-[#006CFF]/50 focus-within:ring-2 focus-within:ring-[#006CFF]/15">
                      <span className="border-r border-[var(--ink)]/10 bg-[var(--ink)]/[0.03] px-4 py-3.5 text-base text-[var(--ink)]/45 lg:py-4">
                        @
                      </span>
                      <input
                        value={data.instagram}
                        onChange={(e) => update("instagram", e.target.value.replace(/^@/, ""))}
                        placeholder={current.placeholder}
                        autoFocus={shouldAutoFocus}
                        className="w-full bg-transparent px-4 py-3.5 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/35 lg:py-4"
                      />
                    </div>
                  </Field>
                ) : null}

                {current.type === "radio" && current.options ? (
<<<<<<< HEAD
<<<<<<< HEAD
                  <Field error={isOutroSelected ? undefined : errors[current.field]}>
                    {isOutroSelected ? (
                      <div className="space-y-2">
                        <OutroChoice
                          label={DESAFIO_OUTRO}
                          checked
                          value={data.desafioOutro}
                          error={errors.desafioOutro}
                          onSelect={() => {}}
                          onChange={(v) => {
                            update("desafioOutro", v);
                            setErrors((err) => ({ ...err, desafioOutro: undefined }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            update("desafio", "");
                            update("desafioOutro", "");
                            setErrors((e) => ({ ...e, desafio: undefined, desafioOutro: undefined }));
                          }}
                          className="text-xs font-medium text-[#006CFF] transition hover:underline sm:text-sm"
                        >
                          ← Ver outras opções
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-1.5 sm:gap-2">
                        {current.options.map((opt) => {
                          const isOutro = isDesafioStep && opt === DESAFIO_OUTRO;

                          if (isOutro) {
                            return (
                              <OutroChoice
                                key={opt}
                                label={opt}
                                checked={data.desafio === opt}
                                value={data.desafioOutro}
                                error={errors.desafioOutro}
                                onSelect={() => {
                                  update("desafio", opt);
                                  setErrors((e) => ({ ...e, desafio: undefined, desafioOutro: undefined }));
                                }}
                                onChange={(v) => {
                                  update("desafioOutro", v);
                                  setErrors((err) => ({ ...err, desafioOutro: undefined }));
                                }}
                              />
                            );
                          }
=======
                  <Field error={current.field === "desafio" && data.desafio === DESAFIO_OUTRO ? undefined : errors[current.field]}>
                    <div className="grid gap-1.5 sm:gap-2">
                      {current.options.map((opt) => {
                        const isOutro = current.field === "desafio" && opt === DESAFIO_OUTRO;
>>>>>>> parent of 58178fa (2)

                        if (isOutro) {
                          return (
                            <OutroChoice
                              key={opt}
                              label={opt}
                              checked={data.desafio === opt}
                              value={data.desafioOutro}
                              error={errors.desafioOutro}
                              onSelect={() => {
                                update("desafio", opt);
                                setErrors((e) => ({ ...e, desafio: undefined, desafioOutro: undefined }));
                              }}
                              onChange={(v) => {
                                update("desafioOutro", v);
                                setErrors((err) => ({ ...err, desafioOutro: undefined }));
                              }}
                            />
                          );
<<<<<<< HEAD
                        })}
                      </div>
                    )}
=======
                  <Field error={errors[current.field]}>
                    <div className="grid gap-1.5 sm:gap-2">
                      {current.options.map((opt) => (
                        <Choice
                          key={opt}
                          label={opt}
                          checked={data[current.field] === opt}
                          onClick={() => {
                            if (current.field === "desafio" && opt !== DESAFIO_OUTRO) {
                              update("desafioOutro", "");
                              setErrors((e) => ({ ...e, desafioOutro: undefined }));
                            }
                            update(current.field, opt);
                            setErrors((e) => ({ ...e, [current.field]: undefined }));
                          }}
                        />
                      ))}
                    </div>
                    {current.field === "desafio" && data.desafio === DESAFIO_OUTRO ? (
                      <div className="mt-3">
                        <Field error={errors.desafioOutro}>
                          <input
                            type="text"
                            value={data.desafioOutro}
                            onChange={(e) => {
                              update("desafioOutro", e.target.value);
                              setErrors((err) => ({ ...err, desafioOutro: undefined }));
                            }}
                            placeholder="Descreva seu principal desafio"
                            autoFocus={data.desafioOutro.trim().length === 0}
                            className={inputCls}
                          />
                        </Field>
                      </div>
                    ) : null}
>>>>>>> parent of 145708a (Update AnaliseWizard.tsx)
=======
                        }

                        return (
                          <Choice
                            key={opt}
                            label={opt}
                            checked={data[current.field] === opt}
                            onClick={() => {
                              if (current.field === "desafio") {
                                update("desafioOutro", "");
                                setErrors((e) => ({ ...e, desafioOutro: undefined }));
                              }
                              update(current.field, opt);
                              setErrors((e) => ({ ...e, [current.field]: undefined }));
                            }}
                          />
                        );
                      })}
                    </div>
>>>>>>> parent of 58178fa (2)
                  </Field>
                ) : null}
              </div>
            </div>

<<<<<<< HEAD
            <div
              className={cn(
                "flex shrink-0 flex-col gap-3 pt-2 sm:pt-4",
                "max-lg:fixed max-lg:inset-x-0 max-lg:z-[110] max-lg:border-t max-lg:border-[var(--ink)]/8",
                "max-lg:bg-[var(--paper)]/95 max-lg:px-5 max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:pt-3 max-lg:backdrop-blur-sm",
                "lg:relative lg:z-auto lg:border-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-2",
              )}
              style={{ bottom: keyboardInset }}
            >
=======
            <div className="flex shrink-0 flex-col gap-3 pt-2 sm:pt-4">
>>>>>>> parent of 58178fa (2)
              {isLast ? (
                <PrivacyConsentField
                  checked={data.consentimentoPrivacidade}
                  error={errors.consentimentoPrivacidade ?? submitError ?? undefined}
                  onCheckedChange={(checked) => {
                    update("consentimentoPrivacidade", checked);
                    setSubmitError(null);
                  }}
                />
              ) : null}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-[13px] font-semibold uppercase tracking-wide whitespace-nowrap text-[#031225] shadow-[0_16px_48px_-16px_rgba(0,108,255,0.55)] transition hover:scale-[1.02] sm:px-8 sm:py-4 sm:text-base"
                >
                  {isLast ? "Quero receber minha análise gratuita" : "Prosseguir"}
                  <span className="transition duration-300 group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            </div>
          </div>
          </form>

          {step === 0 ? <EntregaveisCard /> : null}
        </div>
      )}
    </AnaliseFormChrome>
  );
}

function PrivacyConsentField({
  checked,
  error,
  onCheckedChange,
}: {
  checked: boolean;
  error?: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="w-full">
      <label className="flex cursor-pointer items-start gap-3 text-left">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          className="mt-0.5 border-[var(--ink)]/25 data-[state=checked]:border-[#006CFF] data-[state=checked]:bg-[#006CFF]"
          aria-invalid={!!error}
        />
        <span className="text-xs leading-relaxed text-[var(--ink)]/65 sm:text-sm">
          Li e concordo com a{" "}
          <Link to="/privacidade" className="font-medium text-[#006CFF] hover:underline" target="_blank">
            Política de Privacidade
          </Link>{" "}
          (v{LEGAL.privacyPolicyVersion}) e autorizo o uso dos meus dados para contato sobre a
          análise gratuita.
        </span>
      </label>
      {error ? <p className="mt-2 text-xs text-[#E85D6F]">{error}</p> : null}
    </div>
  );
}

function Field({
  hint,
  error,
  children,
}: {
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {hint ? <p className="mb-2 text-xs text-[var(--ink)]/40">{hint}</p> : null}
      {children}
      {error ? <p className="mt-2 text-xs text-[#E85D6F]">{error}</p> : null}
    </div>
  );
}

function Choice({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[13px] transition sm:gap-4 sm:px-5 sm:py-4 sm:text-sm",
        checked
          ? "border-[#006CFF]/40 bg-[#006CFF]/[0.06] text-[var(--ink)]"
          : "border-[var(--ink)]/10 bg-white text-[var(--ink)]/75 hover:border-[var(--ink)]/18 hover:bg-[var(--ink)]/[0.02]",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition",
          checked ? "border-[#006CFF] bg-[#006CFF] text-white" : "border-[var(--ink)]/20",
        )}
      >
        {checked ? (
          <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
            <path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

function EntregaveisCard({ className }: { className?: string }) {
  return (
    <div className={cn("mt-4 shrink-0 pb-1 lg:mt-8 lg:pb-0", className)}>
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#006CFF]/70">
        O que você recebe em 24h
      </p>
      <ul className="mt-2 space-y-1.5 lg:mt-3 lg:space-y-2">
        {ENTREGAVEIS.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ink)]/65 sm:text-sm">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gradient-brand" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SuccessState({ data }: { data: AnaliseFormData }) {
  const firstName = data.nome.split(" ")[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-4 text-center animate-in fade-in zoom-in-95 duration-500 sm:py-10">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-brand text-2xl text-[#031225] sm:h-20 sm:w-20 sm:text-3xl">
        ✓
      </div>
      <h2 className="mt-5 text-balance text-xl font-bold tracking-tight text-[var(--ink)] sm:mt-8 sm:text-3xl">
        Recebemos sua solicitação, {firstName}!
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--ink)]/65 sm:mt-4 sm:text-base">
        Em até 24 horas nossa equipe entrará em contato no WhatsApp{" "}
        <span className="font-medium text-[var(--ink)]">{data.whatsapp}</span> com a análise inicial do marketing da{" "}
        <span className="font-medium text-[var(--ink)]">{data.empresa}</span>.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/12 px-6 py-3 text-sm font-medium text-[var(--ink)]/75 transition hover:bg-[var(--ink)]/[0.03] sm:mt-10"
      >
        ← Voltar para o site
      </Link>
    </div>
  );
}
