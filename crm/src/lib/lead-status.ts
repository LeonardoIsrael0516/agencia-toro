import type { LeadStatus } from "@agencia-toro/shared";
import { LEAD_STATUSES } from "@agencia-toro/shared";

export type LeadStatusConfig = {
  label: string;
  shortLabel: string;
  description: string;
  columnTitle: string;
};

export const LEAD_STATUS_CONFIG: Record<LeadStatus, LeadStatusConfig> = {
  novo: {
    label: "Novo",
    shortLabel: "Novo",
    columnTitle: "Novos",
    description: "Lead recém-chegado, ainda não triado.",
  },
  em_contato: {
    label: "Contatar no WhatsApp",
    shortLabel: "WhatsApp",
    columnTitle: "Contatar no WhatsApp",
    description: "Prioridade para iniciar conversa no WhatsApp.",
  },
  qualificado: {
    label: "Qualificado",
    shortLabel: "Qualificado",
    columnTitle: "Qualificados",
    description: "Perfil alinhado, em negociação ou follow-up.",
  },
  perdido: {
    label: "Não qualificado agora",
    shortLabel: "Não qualificado",
    columnTitle: "Não qualificado agora",
    description: "Fora do perfil ou sem fit no momento.",
  },
  convertido: {
    label: "Convertido",
    shortLabel: "Convertido",
    columnTitle: "Convertidos",
    description: "Virou cliente ou fechou contrato.",
  },
};

export const PIPELINE_STATUSES = LEAD_STATUSES;

export function getStatusLabel(status: LeadStatus) {
  return LEAD_STATUS_CONFIG[status].label;
}

export function groupLeadsByStatus<T extends { status: LeadStatus }>(items: T[]) {
  const groups = Object.fromEntries(PIPELINE_STATUSES.map((s) => [s, [] as T[]])) as Record<
    LeadStatus,
    T[]
  >;
  for (const item of items) {
    groups[item.status].push(item);
  }
  return groups;
}

export function countByStatus<T extends { status: LeadStatus }>(items: T[]) {
  const counts = Object.fromEntries(PIPELINE_STATUSES.map((s) => [s, 0])) as Record<
    LeadStatus,
    number
  >;
  for (const item of items) {
    counts[item.status] += 1;
  }
  return counts;
}
