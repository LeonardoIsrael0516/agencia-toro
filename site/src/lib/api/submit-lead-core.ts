import { DESAFIO_OUTRO, leadFormFieldsSchema } from "@agencia-toro/shared";
import { z } from "zod";

import { getServerConfig } from "../config.server";
import { listWorkerEnvKeys } from "../runtime-env";

export const submitLeadInput = leadFormFieldsSchema
  .extend({
    privacyPolicyVersion: z.string().min(1),
    consentedAt: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.desafio === DESAFIO_OUTRO && (data.desafioOutro?.trim().length ?? 0) < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Descreva seu desafio",
        path: ["desafioOutro"],
      });
    }
  });

export type SubmitLeadInput = z.infer<typeof submitLeadInput>;

export function parseSubmitLeadBody(input: unknown): SubmitLeadInput {
  return submitLeadInput.parse(input);
}

export class SubmitLeadError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message);
    this.name = "SubmitLeadError";
  }
}

export async function ingestLeadToApi(data: SubmitLeadInput): Promise<{ ok: true }> {
  const config = getServerConfig();

  if (!config.leadIngestSecret) {
    console.error(
      "[submit-lead] LEAD_INGEST_SECRET ausente no Worker. Env keys:",
      listWorkerEnvKeys().join(", ") || "(nenhuma)",
    );
    throw new SubmitLeadError("Serviço temporariamente indisponível. Tente novamente em instantes.", 503);
  }

  const payload = {
    nome: data.nome.trim(),
    whatsapp: data.whatsapp.trim(),
    empresa: data.empresa.trim(),
    segmento: data.segmento.trim(),
    instagram: data.instagram?.trim() || "",
    faturamento: data.faturamento,
    desafio: data.desafio,
    desafioOutro: data.desafio === DESAFIO_OUTRO ? data.desafioOutro?.trim() || "" : "",
    privacyPolicyVersion: data.privacyPolicyVersion,
    consentedAt: data.consentedAt,
    source: "analise" as const,
  };

  const apiUrl = `${config.apiUrl}/api/public/leads`;

  let res: Response;
  try {
    res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Lead-Secret": config.leadIngestSecret,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[submit-lead] fetch failed:", apiUrl, error);
    throw new SubmitLeadError("Não foi possível conectar ao serviço. Tente novamente em instantes.", 502);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[submit-lead] API error:", res.status, apiUrl, body.slice(0, 400));

    if (res.status === 401 || res.status === 403) {
      throw new SubmitLeadError("Serviço temporariamente indisponível. Tente novamente em instantes.", res.status);
    }
    if (res.status === 400) {
      throw new SubmitLeadError("Revise os dados do formulário e tente novamente.", 400);
    }
    throw new SubmitLeadError(
      `Não foi possível enviar sua solicitação (erro ${res.status}). Tente novamente.`,
      res.status,
    );
  }

  return { ok: true as const };
}
