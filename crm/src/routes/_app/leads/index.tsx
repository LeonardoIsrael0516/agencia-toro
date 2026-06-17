import { DESAFIO_OUTRO, LEAD_STATUSES, type LeadStatus } from "@agencia-toro/shared";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Columns3, Search, Table2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import { LeadsKanban } from "@/components/LeadsKanban";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { AuthError, fetchLeads } from "@/lib/api";
import {
  countByStatus,
  getStatusLabel,
  groupLeadsByStatus,
  LEAD_STATUS_CONFIG,
} from "@/lib/lead-status";
import { cn, formatDate, instagramUrl, whatsappUrl } from "@/lib/utils";

export const Route = createFileRoute("/_app/leads/")({
  component: LeadsPage,
});

type ViewMode = "pipeline" | "table";

function LeadsPage() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<ViewMode>("pipeline");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["leads", view, statusFilter, search],
    enabled: !!user,
    queryFn: () =>
      fetchLeads({
        status: view === "table" && statusFilter !== "all" ? statusFilter : undefined,
        q: search || undefined,
        pageSize: view === "pipeline" ? 100 : 50,
      }),
  });

  const items = query.data?.items ?? [];
  const counts = countByStatus(items);
  const groups = groupLeadsByStatus(items);
  const total = query.data?.total ?? items.length;

  useEffect(() => {
    if (query.error instanceof AuthError) {
      void logout();
    }
  }, [query.error, logout]);

  const tabs = ["all", ...LEAD_STATUSES] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Leads</h1>
          <p className="mt-1 text-sm text-navy/60">
            Organize por etapa: novo, contato no WhatsApp, qualificado e mais.
          </p>
        </div>
        <div className="flex rounded-lg border border-navy/10 bg-white p-1">
          <ViewToggle active={view === "pipeline"} onClick={() => setView("pipeline")} icon={Columns3}>
            Pipeline
          </ViewToggle>
          <ViewToggle active={view === "table"} onClick={() => setView("table")} icon={Table2}>
            Tabela
          </ViewToggle>
        </div>
      </div>

      <form
        className="relative max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q.trim());
        }}
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy/35" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar nome, empresa ou WhatsApp"
          className="pl-9"
        />
      </form>

      {view === "pipeline" ? (
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.map((status) => (
            <span
              key={status}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-navy/70 ring-1 ring-navy/10"
            >
              <span className="font-medium">{LEAD_STATUS_CONFIG[status].shortLabel}</span>
              <span className="tabular-nums text-navy/45">{counts[status]}</span>
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
            Total <span className="tabular-nums">{total}</span>
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                statusFilter === tab
                  ? "bg-navy text-white"
                  : "bg-white text-navy/70 ring-1 ring-navy/10 hover:bg-slate-50",
              )}
            >
              {tab === "all" ? "Todos" : getStatusLabel(tab)}
              {tab !== "all" && items.length > 0 && statusFilter === tab ? (
                <span className="ml-1 opacity-70">({items.length})</span>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {query.isLoading ? (
        <p className="text-sm text-navy/50">Carregando leads...</p>
      ) : query.isError ? (
        <p className="text-sm text-red-600">
          {query.error instanceof AuthError
            ? "Sessão expirada. Redirecionando para login..."
            : "Erro ao carregar leads."}
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy/15 bg-white px-6 py-16 text-center">
          <p className="text-lg font-medium text-navy">Nenhum lead encontrado</p>
          <p className="mt-2 text-sm text-navy/55">
            Quando alguém preencher o formulário /analise, aparecerá aqui.
          </p>
        </div>
      ) : view === "pipeline" ? (
        <LeadsKanban groups={groups} counts={counts} />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-navy/10 bg-white md:block">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="border-b border-navy/10 bg-slate-50 text-xs uppercase tracking-wide text-navy/50">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Nome</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">WhatsApp</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Empresa</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Segmento</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Instagram</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Faturamento</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Principal desafio</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Descrição do desafio</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Etapa</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Recebido em</th>
                </tr>
              </thead>
              <tbody>
                {items.map((lead) => {
                  const instagramHandle = lead.instagram?.trim().replace(/^@/, "") ?? "";
                  const desafioDetalhe =
                    lead.desafio === DESAFIO_OUTRO && lead.desafioOutro?.trim()
                      ? lead.desafioOutro.trim()
                      : null;

                  return (
                  <tr key={lead.id} className="border-b border-navy/5 hover:bg-slate-50/80">
                    <td className="max-w-[140px] px-4 py-3 font-medium">
                      <Link
                        to="/leads/$id"
                        params={{ id: lead.id }}
                        className="text-brand-blue hover:underline"
                        title={lead.nome}
                      >
                        {lead.nome}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={whatsappUrl(lead.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-blue hover:underline"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-3" title={lead.empresa}>
                      {lead.empresa}
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-3" title={lead.segmento}>
                      {lead.segmento}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/70">
                      {instagramHandle ? (
                        <a
                          href={instagramUrl(instagramHandle) ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-blue hover:underline"
                        >
                          @{instagramHandle}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3" title={lead.faturamento}>
                      {lead.faturamento}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3" title={lead.desafio}>
                      {lead.desafio}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3" title={desafioDetalhe ?? undefined}>
                      {desafioDetalhe ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusSelect leadId={lead.id} value={lead.status} compact />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/60">{formatDate(lead.createdAt)}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {items.map((lead) => (
              <div key={lead.id} className="rounded-xl border border-navy/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link to="/leads/$id" params={{ id: lead.id }} className="min-w-0">
                    <p className="font-semibold text-navy">{lead.nome}</p>
                    <p className="text-sm text-navy/60">{lead.empresa}</p>
                  </Link>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="mt-3">
                  <LeadStatusSelect leadId={lead.id} value={lead.status} />
                </div>
                <dl className="mt-3 grid gap-2 text-sm text-navy/70">
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-navy/45">WhatsApp:</dt>
                    <dd>
                      <a
                        href={whatsappUrl(lead.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-blue hover:underline"
                      >
                        {lead.whatsapp}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-navy/45">Segmento:</dt>
                    <dd>{lead.segmento}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-navy/45">Instagram:</dt>
                    <dd>
                      {lead.instagram?.trim()
                        ? `@${lead.instagram.replace(/^@/, "")}`
                        : "Não informado"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-navy/45">Faturamento:</dt>
                    <dd>{lead.faturamento}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-navy/45">Principal desafio:</dt>
                    <dd>{lead.desafio}</dd>
                  </div>
                  {lead.desafio === DESAFIO_OUTRO && lead.desafioOutro?.trim() ? (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-navy/45">Descrição:</dt>
                      <dd>{lead.desafioOutro.trim()}</dd>
                    </div>
                  ) : null}
                </dl>
                <p className="mt-2 text-xs text-navy/45">{formatDate(lead.createdAt)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Columns3;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
        active ? "bg-navy text-white" : "text-navy/60 hover:text-navy",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}
