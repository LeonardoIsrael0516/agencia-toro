import type { LeadStatus } from "@agencia-toro/shared";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AuthError, fetchLeadStats } from "@/lib/api";
import { LEAD_STATUS_CONFIG, PIPELINE_STATUSES } from "@/lib/lead-status";
import { cn, formatDate, whatsappUrl } from "@/lib/utils";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, logout } = useAuth();

  const query = useQuery({
    queryKey: ["lead-stats"],
    queryFn: fetchLeadStats,
  });

  if (query.isError && query.error instanceof AuthError) {
    void logout();
  }

  const stats = query.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-blue">Visão geral</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">
            Olá, {user?.name?.split(" ")[0] ?? "equipe"}
          </h1>
          <p className="mt-1 text-sm text-navy/60">
            Métricas do funil de leads do formulário de análise.
          </p>
        </div>
        <Button asChild variant="brand">
          <Link to="/leads">
            Ver pipeline
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-navy/50">Carregando métricas...</p>
      ) : query.isError || !stats ? (
        <p className="text-sm text-red-600">Erro ao carregar dashboard.</p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              label="Total de leads"
              value={String(stats.total)}
              hint="Todos os cadastros"
              icon={Users}
              accent="bg-brand-blue/10 text-brand-blue"
            />
            <KpiCard
              label="Novos hoje"
              value={String(stats.today)}
              hint="Desde meia-noite"
              icon={CalendarDays}
              accent="bg-brand-cyan/15 text-brand-blue"
            />
            <KpiCard
              label="Últimos 7 dias"
              value={String(stats.last7Days)}
              hint={`${stats.last30Days} nos últimos 30 dias`}
              icon={TrendingUp}
              accent="bg-emerald-50 text-emerald-700"
            />
            <KpiCard
              label="Aguardando contato"
              value={String(stats.awaitingContact)}
              hint="Novos + WhatsApp"
              icon={MessageCircle}
              accent="bg-amber-50 text-amber-800"
            />
            <KpiCard
              label="Taxa de conversão"
              value={`${stats.conversionRate}%`}
              hint={`${stats.qualificationRate}% qualificados`}
              icon={Target}
              accent="bg-violet-50 text-violet-700"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-2xl border border-navy/10 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/45">
                Funil por etapa
              </h2>
              <div className="mt-5 space-y-4">
                {PIPELINE_STATUSES.map((status) => (
                  <PipelineBar
                    key={status}
                    status={status}
                    count={stats.byStatus[status]}
                    total={stats.total}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <RankingCard title="Top segmentos" items={stats.topSegmentos} empty="Nenhum segmento ainda." />
              <RankingCard title="Principais desafios" items={stats.topDesafios} empty="Nenhum desafio registrado." />
            </div>
          </section>

          <section className="rounded-2xl border border-navy/10 bg-white p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/45">
                Leads recentes
              </h2>
              <Link to="/leads" className="text-sm font-medium text-brand-blue hover:underline">
                Ver todos
              </Link>
            </div>
            {stats.recent.length === 0 ? (
              <p className="text-sm text-navy/50">Nenhum lead recebido ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-navy/10 text-xs uppercase tracking-wide text-navy/45">
                    <tr>
                      <th className="pb-3 font-medium">Nome</th>
                      <th className="pb-3 font-medium">Empresa</th>
                      <th className="pb-3 font-medium">Segmento</th>
                      <th className="pb-3 font-medium">Etapa</th>
                      <th className="pb-3 font-medium">Recebido</th>
                      <th className="pb-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((lead) => (
                      <tr key={lead.id} className="border-b border-navy/5 last:border-0">
                        <td className="py-3 font-medium">
                          <Link
                            to="/leads/$id"
                            params={{ id: lead.id }}
                            className="text-brand-blue hover:underline"
                          >
                            {lead.nome}
                          </Link>
                        </td>
                        <td className="py-3">{lead.empresa}</td>
                        <td className="py-3">{lead.segmento}</td>
                        <td className="py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="py-3 text-navy/60">{formatDate(lead.createdAt)}</td>
                        <td className="py-3 text-right">
                          <a
                            href={whatsappUrl(lead.whatsapp)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-brand-blue hover:underline"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-navy/45">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-navy">{value}</p>
          <p className="mt-1 text-xs text-navy/50">{hint}</p>
        </div>
        <div className={cn("rounded-xl p-2.5", accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function PipelineBar({
  status,
  count,
  total,
}: {
  status: LeadStatus;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const config = LEAD_STATUS_CONFIG[status];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-navy">{config.shortLabel}</span>
        <span className="tabular-nums text-navy/55">
          {count} · {pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-brand transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RankingCard({
  title,
  items,
  empty,
}: {
  title: string;
  items: { label: string; count: number }[];
  empty: string;
}) {
  const max = items[0]?.count ?? 0;

  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/45">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-navy/50">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-navy">{item.label}</span>
                <span className="shrink-0 tabular-nums text-navy/50">{item.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-navy/70"
                  style={{ width: `${max > 0 ? (item.count / max) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
