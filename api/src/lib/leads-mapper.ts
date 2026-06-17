import type { DbLead } from "../db/schema.js";
import type { LeadRecord } from "@agencia-toro/shared";

export function mapLead(row: DbLead): LeadRecord {
  return {
    id: row.id,
    nome: row.nome,
    whatsapp: row.whatsapp,
    empresa: row.empresa,
    segmento: row.segmento,
    instagram: row.instagram,
    faturamento: row.faturamento,
    desafio: row.desafio,
    desafioOutro: row.desafioOutro,
    desafioDisplay: row.desafioDisplay,
    status: row.status as LeadRecord["status"],
    source: row.source as LeadRecord["source"],
    privacyPolicyVersion: row.privacyPolicyVersion,
    consentedAt: row.consentedAt,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function whatsappDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function whatsappUrl(phone: string) {
  const digits = whatsappDigits(phone);
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${normalized}`;
}
