import { z } from "zod";

export const LEAD_STATUSES = [
  "novo",
  "em_contato",
  "qualificado",
  "perdido",
  "convertido",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const LEAD_SOURCES = ["analise"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export const leadSourceSchema = z.enum(LEAD_SOURCES);

export const DESAFIO_OUTRO = "Outro";

export const leadFormFieldsSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().min(10).max(20),
  empresa: z.string().trim().min(2).max(120),
  segmento: z.string().trim().min(2).max(80),
  instagram: z.string().trim().max(60).optional().or(z.literal("")),
  faturamento: z.string().min(1),
  desafio: z.string().min(1),
  desafioOutro: z.string().trim().max(200).optional().or(z.literal("")),
});

export const leadIngestSchema = leadFormFieldsSchema
  .extend({
    privacyPolicyVersion: z.string().min(1),
    consentedAt: z.string().datetime(),
    source: leadSourceSchema.default("analise"),
  })
  .superRefine((data, ctx) => {
    if (data.desafio === DESAFIO_OUTRO && (data.desafioOutro?.trim().length ?? 0) < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "desafioOutro required when desafio is Outro",
        path: ["desafioOutro"],
      });
    }
  });

export type LeadIngestInput = z.infer<typeof leadIngestSchema>;

export const leadStatusUpdateSchema = z.object({
  status: leadStatusSchema,
});

export function resolveDesafioDisplay(desafio: string, desafioOutro?: string | null) {
  if (desafio === DESAFIO_OUTRO && desafioOutro?.trim()) {
    return desafioOutro.trim();
  }
  return desafio;
}

export type LeadRecord = {
  id: string;
  nome: string;
  whatsapp: string;
  empresa: string;
  segmento: string;
  instagram: string | null;
  faturamento: string;
  desafio: string;
  desafioOutro: string | null;
  desafioDisplay: string;
  status: LeadStatus;
  source: LeadSource;
  privacyPolicyVersion: string;
  consentedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedLeads = {
  items: LeadRecord[];
  total: number;
  page: number;
  pageSize: number;
};

export type LeadDashboardStats = {
  total: number;
  byStatus: Record<LeadStatus, number>;
  today: number;
  last7Days: number;
  last30Days: number;
  awaitingContact: number;
  conversionRate: number;
  qualificationRate: number;
  recent: LeadRecord[];
  topSegmentos: { label: string; count: number }[];
  topDesafios: { label: string; count: number }[];
};
