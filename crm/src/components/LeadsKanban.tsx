import type { LeadRecord, LeadStatus } from "@agencia-toro/shared";
import { useState } from "react";

import { LeadCard } from "@/components/LeadCard";
import { StatusColumnHeader } from "@/components/StatusBadge";
import { readDraggedLeadId, useLeadStatusActions } from "@/hooks/use-lead-status-actions";
import { PIPELINE_STATUSES } from "@/lib/lead-status";
import { cn } from "@/lib/utils";

type LeadsKanbanProps = {
  groups: Record<LeadStatus, LeadRecord[]>;
  counts: Record<LeadStatus, number>;
};

export function LeadsKanban({ groups, counts }: LeadsKanbanProps) {
  const { updateStatus, draggingLeadId, setDraggingLeadId } = useLeadStatusActions();
  const [dropTarget, setDropTarget] = useState<LeadStatus | null>(null);

  function handleDragOver(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(status);
  }

  function handleDrop(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault();
    setDropTarget(null);

    const leadId = readDraggedLeadId(e, draggingLeadId);
    setDraggingLeadId(null);
    if (!leadId) return;

    const lead = PIPELINE_STATUSES.flatMap((s) => groups[s]).find((l) => l.id === leadId);
    if (lead && lead.status !== status) {
      updateStatus(leadId, status);
    }
  }

  return (
    <div className="overflow-x-auto pb-2">
      <p className="mb-3 text-xs text-navy/45">
        Arraste pelo ícone ⋮⋮ ou use o seletor de etapa em cada card.
      </p>
      <div className="flex min-w-max gap-3">
        {PIPELINE_STATUSES.map((status) => (
          <section
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={() => setDropTarget((prev) => (prev === status ? null : prev))}
            onDrop={(e) => handleDrop(e, status)}
            className={cn(
              "flex w-[min(100vw-2rem,300px)] shrink-0 flex-col rounded-xl border bg-slate-50/80 transition",
              dropTarget === status
                ? "border-brand-blue/50 bg-brand-blue/[0.04] ring-2 ring-brand-blue/20"
                : "border-navy/10",
            )}
          >
            <StatusColumnHeader status={status} count={counts[status]} />
            <div className="flex min-h-[160px] flex-1 flex-col gap-2 p-2">
              {groups[status].length === 0 ? (
                <p
                  className={cn(
                    "rounded-lg px-2 py-8 text-center text-xs transition",
                    dropTarget === status ? "text-brand-blue/70" : "text-navy/40",
                  )}
                >
                  {dropTarget === status ? "Solte aqui" : "Nenhum lead nesta etapa"}
                </p>
              ) : (
                groups[status].map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    draggable
                    isDragging={draggingLeadId === lead.id}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
