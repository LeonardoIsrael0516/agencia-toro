import { LEAD_STATUSES, type LeadStatus } from "@agencia-toro/shared";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect } from "react";

import { LeadFormAnswers } from "@/components/LeadFormAnswers";
import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useLeadStatusActions } from "@/hooks/use-lead-status-actions";
import { useAuth } from "@/lib/auth-context";
import { AuthError, fetchLead } from "@/lib/api";
import { getStatusLabel, LEAD_STATUS_CONFIG } from "@/lib/lead-status";
import { cn, formatDate, instagramUrl, whatsappUrl } from "@/lib/utils";

export const Route = createFileRoute("/_app/leads/$id")({
  component: LeadDetailPage,
});

function LeadDetailPage() {
  const { id } = Route.useParams();
  const { user, logout } = useAuth();
  const { updateStatus, isLeadUpdating } = useLeadStatusActions();

  const query = useQuery({
    queryKey: ["lead", id],
    enabled: !!user,
    queryFn: () => fetchLead(id),
  });

  useEffect(() => {
    if (query.error instanceof AuthError) {
      void logout();
    }
  }, [query.error, logout]);

  if (query.isLoading) {
    return <p className="text-sm text-navy/50">Carregando lead...</p>;
  }

  if (query.isError || !query.data) {
    return (
      <div>
        <Link to="/leads" className="inline-flex items-center gap-2 text-sm text-brand-blue hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Voltar para leads
        </Link>
        <p className="mt-6 text-sm text-red-600">Lead não encontrado.</p>
      </div>
    );
  }

  const lead = query.data;
  const insta = lead.instagram ? instagramUrl(lead.instagram) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/leads" className="inline-flex items-center gap-2 text-sm text-brand-blue hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Voltar para leads
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{lead.nome}</h1>
          <p className="mt-1 text-navy/60">{lead.empresa}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="brand">
          <a href={whatsappUrl(lead.whatsapp)} target="_blank" rel="noreferrer">
            Abrir WhatsApp
          </a>
        </Button>
        {insta ? (
          <Button asChild variant="outline">
            <a href={insta} target="_blank" rel="noreferrer">
              Instagram
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/45">Etapa no funil</h2>
        <p className="mt-1 text-sm text-navy/60">{LEAD_STATUS_CONFIG[lead.status].description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {LEAD_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              disabled={isLeadUpdating(id)}
              onClick={() => updateStatus(id, status)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition ring-1",
                lead.status === status
                  ? "bg-navy text-white ring-navy"
                  : "bg-white text-navy/70 ring-navy/10 hover:bg-slate-50",
              )}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>

        <div className="mt-4 max-w-xs">
          <LeadStatusSelect leadId={lead.id} value={lead.status} />
        </div>
      </div>

      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/45">
          Respostas do formulário
        </h2>
        <LeadFormAnswers lead={lead} className="mt-4" />
      </div>

      <div className="rounded-2xl border border-navy/10 bg-slate-50 p-6 text-sm text-navy/65">
        <h2 className="font-semibold text-navy">Metadados LGPD</h2>
        <p className="mt-2">Política de privacidade v{lead.privacyPolicyVersion}</p>
        <p>Consentimento em {formatDate(lead.consentedAt)}</p>
        <p className="mt-2 text-xs text-navy/45">
          Recebido em {formatDate(lead.createdAt)} · Origem: formulário de análise
        </p>
      </div>
    </div>
  );
}
