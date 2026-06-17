import type { LeadRecord } from "@agencia-toro/shared";
import { Link } from "@tanstack/react-router";
import { GripVertical, MessageCircle } from "lucide-react";

import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import { setDraggedLead, useLeadStatusActions } from "@/hooks/use-lead-status-actions";
import { cn, formatDate, whatsappUrl } from "@/lib/utils";

type LeadCardProps = {
  lead: LeadRecord;
  compact?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
};

export function LeadCard({
  lead,
  compact = false,
  draggable = false,
  isDragging = false,
}: LeadCardProps) {
  const { setDraggingLeadId } = useLeadStatusActions();

  return (
    <article
      className={cn(
        "rounded-xl border border-navy/10 bg-white p-3 shadow-sm transition",
        draggable && "hover:border-navy/20 hover:shadow-md",
        isDragging && "scale-[0.98] opacity-40 ring-2 ring-brand-blue/30",
      )}
    >
      <div className="flex items-start gap-2">
        {draggable ? (
          <div
            draggable
            onDragStart={(e) => {
              setDraggedLead(e, lead.id);
              setDraggingLeadId(lead.id);
            }}
            onDragEnd={() => setDraggingLeadId(null)}
            className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-navy/30 hover:bg-slate-100 hover:text-navy/60 active:cursor-grabbing"
            aria-label="Arrastar lead para outra etapa"
            role="button"
            tabIndex={0}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              to="/leads/$id"
              params={{ id: lead.id }}
              className="min-w-0 flex-1 font-semibold text-navy hover:text-brand-blue"
              draggable={false}
            >
              {lead.nome}
            </Link>
            <LeadStatusSelect leadId={lead.id} value={lead.status} compact />
          </div>

          <p className="mt-1 truncate text-sm text-navy/60">{lead.empresa}</p>

          {!compact ? (
            <>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-navy/70">{lead.desafioDisplay}</p>
              <div className="mt-2 space-y-1 text-[11px] text-navy/50">
                <p>
                  <span className="text-navy/40">WhatsApp:</span> {lead.whatsapp}
                </p>
                <p>
                  <span className="text-navy/40">Segmento:</span> {lead.segmento}
                </p>
                <p>
                  <span className="text-navy/40">Faturamento:</span> {lead.faturamento}
                </p>
                {lead.instagram?.trim() ? (
                  <p>
                    <span className="text-navy/40">Instagram:</span> @{lead.instagram.replace(/^@/, "")}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-navy/5 pt-3">
            <span className="text-[11px] text-navy/45">{formatDate(lead.createdAt)}</span>
            <a
              href={whatsappUrl(lead.whatsapp)}
              target="_blank"
              rel="noreferrer"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition hover:bg-emerald-100"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
