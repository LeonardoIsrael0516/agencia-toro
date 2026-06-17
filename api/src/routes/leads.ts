import { and, count, desc, eq, gte, like, or } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import {
  LEAD_STATUSES,
  type LeadDashboardStats,
  type LeadStatus,
  leadStatusSchema,
} from "@agencia-toro/shared";
import type { Env } from "../config.js";
import { getDb } from "../db/index.js";
import { leads } from "../db/schema.js";
import { mapLead } from "../lib/leads-mapper.js";
import { authenticate } from "../plugins/authenticate.js";
import { z } from "zod";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  status: leadStatusSchema.optional(),
});

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function leadsRoutes(app: FastifyInstance) {
  const env = app.config as Env;
  const db = getDb(env.DATABASE_URL);

  app.addHook("preHandler", authenticate);

  app.get("/stats", async (): Promise<LeadDashboardStats> => {
    const todayStart = startOfToday();
    const weekStart = daysAgo(6);
    const monthStart = daysAgo(29);

    const [totalRow] = await db.select({ value: count() }).from(leads);
    const total = totalRow?.value ?? 0;

    const statusRows = await db
      .select({ status: leads.status, value: count() })
      .from(leads)
      .groupBy(leads.status);

    const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<
      LeadStatus,
      number
    >;
    for (const row of statusRows) {
      if (LEAD_STATUSES.includes(row.status as LeadStatus)) {
        byStatus[row.status as LeadStatus] = row.value;
      }
    }

    const countSince = async (since: Date) => {
      const [row] = await db
        .select({ value: count() })
        .from(leads)
        .where(gte(leads.createdAt, since));
      return row?.value ?? 0;
    };

    const [today, last7Days, last30Days] = await Promise.all([
      countSince(todayStart),
      countSince(weekStart),
      countSince(monthStart),
    ]);

    const awaitingContact = byStatus.novo + byStatus.em_contato;
    const conversionRate = total > 0 ? Math.round((byStatus.convertido / total) * 1000) / 10 : 0;
    const qualificationRate =
      total > 0
        ? Math.round(((byStatus.qualificado + byStatus.convertido) / total) * 1000) / 10
        : 0;

    const recentRows = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(5);

    const segmentoRows = await db
      .select({ label: leads.segmento, value: count() })
      .from(leads)
      .groupBy(leads.segmento)
      .orderBy(desc(count()))
      .limit(5);

    const desafioRows = await db
      .select({ label: leads.desafioDisplay, value: count() })
      .from(leads)
      .groupBy(leads.desafioDisplay)
      .orderBy(desc(count()))
      .limit(5);

    return {
      total,
      byStatus,
      today,
      last7Days,
      last30Days,
      awaitingContact,
      conversionRate,
      qualificationRate,
      recent: recentRows.map(mapLead),
      topSegmentos: segmentoRows.map((r) => ({ label: r.label, count: r.value })),
      topDesafios: desafioRows.map((r) => ({ label: r.label, count: r.value })),
    };
  });

  app.get("/", async (request, reply) => {
    const parsed = listQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { page, pageSize, q, status } = parsed.data;
    const offset = (page - 1) * pageSize;

    const filters = [];
    if (status) filters.push(eq(leads.status, status));
    if (q?.trim()) {
      const term = `%${q.trim()}%`;
      filters.push(
        or(
          like(leads.nome, term),
          like(leads.empresa, term),
          like(leads.whatsapp, term),
        )!,
      );
    }

    const where = filters.length ? and(...filters) : undefined;

    const [totalRow] = await db.select({ value: count() }).from(leads).where(where);
    const rows = await db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      items: rows.map(mapLead),
      total: totalRow?.value ?? 0,
      page,
      pageSize,
    };
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    if (!row) return reply.code(404).send({ error: "Lead não encontrado" });
    return mapLead(row);
  });

  app.patch("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = z.object({ status: leadStatusSchema }).safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const [row] = await db
      .update(leads)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (!row) return reply.code(404).send({ error: "Lead não encontrado" });
    return mapLead(row);
  });
}
