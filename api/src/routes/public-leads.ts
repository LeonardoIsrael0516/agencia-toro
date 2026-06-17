import type { FastifyInstance } from "fastify";

import { leadIngestSchema, resolveDesafioDisplay } from "@agencia-toro/shared";
import type { Env } from "../config.js";
import { getDb } from "../db/index.js";
import { leads } from "../db/schema.js";
import { mapLead } from "../lib/leads-mapper.js";

export async function publicLeadsRoutes(app: FastifyInstance) {
  const env = app.config as Env;
  const db = getDb(env.DATABASE_URL);

  app.post("/", {
    config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    handler: async (request, reply) => {
      const secret = request.headers["x-lead-secret"];
      if (secret !== env.LEAD_INGEST_SECRET) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const parsed = leadIngestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      const data = parsed.data;
      const desafioDisplay = resolveDesafioDisplay(data.desafio, data.desafioOutro);

      const [row] = await db
        .insert(leads)
        .values({
          nome: data.nome,
          whatsapp: data.whatsapp,
          empresa: data.empresa,
          segmento: data.segmento,
          instagram: data.instagram?.trim() || null,
          faturamento: data.faturamento,
          desafio: data.desafio,
          desafioOutro: data.desafioOutro?.trim() || null,
          desafioDisplay,
          source: data.source,
          privacyPolicyVersion: data.privacyPolicyVersion,
          consentedAt: data.consentedAt,
        })
        .returning();

      return reply.code(201).send(mapLead(row));
    },
  });
}
