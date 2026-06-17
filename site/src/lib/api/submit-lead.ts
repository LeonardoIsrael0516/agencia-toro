import { createServerFn } from "@tanstack/react-start";
import { DESAFIO_OUTRO, leadFormFieldsSchema } from "@agencia-toro/shared";
import { z } from "zod";

import { getServerConfig } from "../config.server";

const submitLeadInput = leadFormFieldsSchema
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

function parseSubmitLeadInput(input: unknown) {
  if (input && typeof input === "object" && "data" in input) {
    return submitLeadInput.parse((input as { data: unknown }).data);
  }
  return submitLeadInput.parse(input);
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(parseSubmitLeadInput)
  .handler(async ({ data }) => {
    const config = getServerConfig();

    if (!config.leadIngestSecret) {
      console.error("[submit-lead] LEAD_INGEST_SECRET ausente no Worker");
      throw new Error("Serviço temporariamente indisponível. Tente novamente em instantes.");
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
      throw new Error("Não foi possível conectar ao serviço. Tente novamente em instantes.");
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[submit-lead] API error:", res.status, apiUrl, body.slice(0, 400));

      if (res.status === 401) {
        throw new Error("Serviço temporariamente indisponível. Tente novamente em instantes.");
      }
      if (res.status === 400) {
        throw new Error("Revise os dados do formulário e tente novamente.");
      }
      if (res.status === 403) {
        throw new Error("Serviço temporariamente indisponível. Tente novamente em instantes.");
      }
      throw new Error(`Não foi possível enviar sua solicitação (erro ${res.status}). Tente novamente.`);
    }

    return { ok: true as const };
  });
