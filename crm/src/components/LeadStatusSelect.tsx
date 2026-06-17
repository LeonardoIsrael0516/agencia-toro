import type { LeadStatus } from "@agencia-toro/shared";
import { LEAD_STATUSES } from "@agencia-toro/shared";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { useLeadStatusActions } from "@/hooks/use-lead-status-actions";
import { getStatusLabel } from "@/lib/lead-status";
import { cn } from "@/lib/utils";

type LeadStatusSelectProps = {
  leadId: string;
  value: LeadStatus;
  compact?: boolean;
  className?: string;
};

export function LeadStatusSelect({
  leadId,
  value,
  compact = false,
  className,
}: LeadStatusSelectProps) {
  const { updateStatus, isLeadUpdating } = useLeadStatusActions();
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className={cn("relative inline-flex", className)} onClick={(e) => e.stopPropagation()}>
      <select
        value={local}
        disabled={isLeadUpdating(leadId)}
        onChange={(e) => {
          const next = e.target.value as LeadStatus;
          if (next === local) return;
          setLocal(next);
          updateStatus(leadId, next);
        }}
        className={cn(
          "appearance-none rounded-lg border border-navy/15 bg-white pr-8 text-navy outline-none transition focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/15 disabled:opacity-60",
          compact ? "h-8 max-w-[9.5rem] px-2.5 text-xs" : "h-9 px-3 text-sm",
        )}
        aria-label="Alterar etapa do lead"
      >
        {LEAD_STATUSES.map((status) => (
          <option key={status} value={status}>
            {getStatusLabel(status)}
          </option>
        ))}
      </select>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-navy/40",
          compact ? "h-3.5 w-3.5" : "h-4 w-4",
        )}
        aria-hidden
      />
    </div>
  );
}
