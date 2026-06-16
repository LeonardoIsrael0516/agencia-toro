import { z } from "zod";

export const FAIXAS = [
  "Até R$ 10 mil",
  "De R$ 10 mil a R$ 30 mil",
  "De R$ 30 mil a R$ 50 mil",
  "De R$ 50 mil a R$ 100 mil",
  "Acima de R$ 100 mil",
] as const;

export const DESAFIO_OUTRO = "Outro";

export const DESAFIOS = [
  "Conseguir mais pacientes/clientes",
  "Aumentar as vendas",
  "Melhorar o posicionamento da marca",
  "Estruturar a equipe comercial",
  "Melhorar os resultados do tráfego pago",
  DESAFIO_OUTRO,
] as const;

export const NICHOS = [
  "Clínicas médicas",
  "Consultórios odontológicos",
  "Clínicas de estética",
  "Dermatologistas",
  "Cirurgiões plásticos",
  "Nutricionistas",
  "Psicólogos",
  "Fisioterapeutas",
  "Academias",
  "Centros de bem-estar",
] as const;

export const ENTREGAVEIS = [
  "Diagnóstico inicial do seu marketing e presença digital",
  "Oportunidades de melhoria identificadas pela nossa equipe",
  "Direcionamento estratégico personalizado, sem compromisso",
] as const;

const analiseFieldsSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo").max(120),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  empresa: z.string().trim().min(2, "Informe o nome da empresa").max(120),
  segmento: z.string().trim().min(2, "Informe o segmento").max(80),
  instagram: z.string().trim().max(60).optional().or(z.literal("")),
  faturamento: z.string().min(1, "Selecione uma faixa"),
  desafio: z.string().min(1, "Selecione um desafio"),
  desafioOutro: z.string().trim().max(200).optional().or(z.literal("")),
  consentimentoPrivacidade: z.boolean().refine((v) => v === true, {
    message: "É necessário aceitar a Política de Privacidade para continuar.",
  }),
});

export const analiseSchema = analiseFieldsSchema.superRefine((data, ctx) => {
  if (data.desafio === DESAFIO_OUTRO && data.desafioOutro.trim().length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Descreva seu desafio em pelo menos 3 caracteres",
      path: ["desafioOutro"],
    });
  }
});

export type AnaliseFormData = z.infer<typeof analiseSchema>;

export const EMPTY_FORM: AnaliseFormData = {
  nome: "",
  whatsapp: "",
  empresa: "",
  segmento: "",
  instagram: "",
  faturamento: "",
  desafio: "",
  desafioOutro: "",
  consentimentoPrivacidade: false,
};

export type StepField = keyof AnaliseFormData;

export type StepType = "text" | "tel" | "instagram" | "radio";

export type AnaliseStep = {
  field: StepField;
  question: string;
  greeting?: string;
  type: StepType;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  options?: readonly string[];
};

export const ANALISE_STEPS: AnaliseStep[] = [
  {
    field: "nome",
    greeting: "É um prazer te receber aqui!",
    question: "Como devemos te chamar?",
    type: "text",
    placeholder: "Digite seu nome e sobrenome",
  },
  {
    field: "whatsapp",
    question: "Qual seu WhatsApp?",
    type: "tel",
    placeholder: "(11) 99999-9999",
  },
  {
    field: "empresa",
    question: "Qual o nome da sua empresa?",
    type: "text",
    placeholder: "Sua clínica ou negócio",
  },
  {
    field: "segmento",
    question: "Qual seu segmento?",
    type: "text",
    placeholder: "Ex: Odontologia, dermatologia, estética",
  },
  {
    field: "instagram",
    question: "Qual o Instagram da empresa?",
    type: "instagram",
    placeholder: "suaclinica",
    hint: "Opcional",
    optional: true,
  },
  {
    field: "faturamento",
    question: "Qual o faturamento mensal aproximado?",
    type: "radio",
    options: FAIXAS,
  },
  {
    field: "desafio",
    question: "Qual seu principal desafio hoje?",
    type: "radio",
    options: DESAFIOS,
  },
];

export const TOTAL_STEPS = ANALISE_STEPS.length;

export function validateStep(stepIndex: number, data: AnaliseFormData) {
  const step = ANALISE_STEPS[stepIndex];
  if (step.field === "desafio") {
    return analiseFieldsSchema
      .pick({ desafio: true, desafioOutro: true })
      .superRefine((values, ctx) => {
        if (values.desafio === DESAFIO_OUTRO && values.desafioOutro.trim().length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Descreva seu desafio em pelo menos 3 caracteres",
            path: ["desafioOutro"],
          });
        }
      })
      .safeParse({ desafio: data.desafio, desafioOutro: data.desafioOutro });
  }
  const partialSchema = analiseFieldsSchema.pick({ [step.field]: true } as Record<StepField, true>);
  return partialSchema.safeParse({ [step.field]: data[step.field] });
}
