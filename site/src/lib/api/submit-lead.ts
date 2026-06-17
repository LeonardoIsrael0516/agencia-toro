import { createServerFn } from "@tanstack/react-start";
import { DESAFIO_OUTRO, leadFormFieldsSchema } from "@agencia-toro/shared";
import { z } from "zod";

import { getServerConfig } from "../config.server";

const submitLeadInput = leadFormFieldsSchema
  .extend({
    privacyPolicyVersion: z.string().min(1),
    consentedAt: z.string().datetime(),
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

export const submitLead = createServerFn({ method: "POST" })
  .validator(submitLeadInput)
  .handler(async ({ data }) => {
    const config = getServerConfig();

    if (!config.leadIngestSecret) {
      throw new Error("Serviço temporariamente indisponível. Tente novamente em instantes.");
    }

    const payload = {
      ...data,
      instagram: data.instagram?.trim() || undefined,
      desafioOutro: data.desafio === DESAFIO_OUTRO ? data.desafioOutro?.trim() : undefined,
      source: "analise" as const,
    };

    let res: Response;
    try {
      res = await fetch(`${config.apiUrl}/api/public/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Lead-Secret": config.leadIngestSecret,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("[submit-lead] fetch failed:", config.apiUrl, error);
      throw new Error("Não foi possível conectar ao serviço. Tente novamente em instantes.");
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[submit-lead] API error:", res.status, config.apiUrl, body.slice(0, 400));

      if (res.status === 401) {
        throw new Error("Serviço temporariamente indisponível. Tente novamente em instantes.");
      }
      if (res.status === 400) {
        throw new Error("Revise os dados do formulário e tente novamente.");
      }
      throw new Error("Não foi possível enviar sua solicitação. Tente novamente em instantes.");
    }

    return { ok: true as const };
  });
