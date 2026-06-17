import { createServerFn } from "@tanstack/react-start";

import { ingestLeadToApi, parseSubmitLeadBody } from "./submit-lead-core";

/** Mantido para dev; em producao o formulario usa /lead-ingest via fetch. */
export const submitLead = createServerFn({ method: "POST" })
<<<<<<< HEAD
  .inputValidator(parseSubmitLeadBody)
  .handler(async ({ data }) => ingestLeadToApi(data));
=======
  .validator(submitLeadInput)
  .handler(async ({ data }) => {
    const config = getServerConfig();

    if (!config.leadIngestSecret) {
      throw new Error("Serviço temporariamente indisponível. Tente novamente em instantes.");
    }

    const payload = {
      ...data,
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
      console.error("[submit-lead] API error:", res.status, body.slice(0, 200));
      throw new Error("Não foi possível enviar sua solicitação. Tente novamente em instantes.");
    }

    return { ok: true as const };
  });
>>>>>>> parent of 58178fa (2)
