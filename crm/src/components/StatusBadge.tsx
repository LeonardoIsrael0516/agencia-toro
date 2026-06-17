import type { LeadStatus } from "@agencia-toro/shared";
import { LEAD_STATUSES } from "@agencia-toro/shared";
import { cva } from "class-variance-authority";

import { getStatusLabel, LEAD_STATUS_CONFIG } from "@/lib/lead-status";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        novo: "bg-blue-100 text-blue-800",
        em_contato: "bg-amber-100 text-amber-900",
        qualificado: "bg-emerald-100 text-emerald-900",
        perdido: "bg-slate-200 text-slate-700",
        convertido: "bg-gradient-brand text-navy",
      },
    },
    defaultVariants: {
      variant: "novo",
    },
  },
);

const columnVariants = cva("rounded-t-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide", {
  variants: {
    variant: {
      novo: "bg-blue-50 text-blue-800",
      em_contato: "bg-amber-50 text-amber-900",
      qualificado: "bg-emerald-50 text-emerald-900",
      perdido: "bg-slate-100 text-slate-700",
      convertido: "bg-gradient-brand/20 text-navy",
    },
  },
});

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span className={cn(badgeVariants({ variant: status }), className)}>
      {getStatusLabel(status)}
    </span>
  );
}

export function StatusColumnHeader({
  status,
  count,
}: {
  status: LeadStatus;
  count: number;
}) {
  const config = LEAD_STATUS_CONFIG[status];
  return (
    <div className={cn(columnVariants({ variant: status }))}>
      <div className="flex items-center justify-between gap-2">
        <span>{config.columnTitle}</span>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] tabular-nums">{count}</span>
      </div>
      <p className="mt-1 text-[10px] font-normal normal-case tracking-normal text-navy/55">
        {config.description}
      </p>
    </div>
  );
}

/** @deprecated use getStatusLabel from lead-status */
export const STATUS_LABELS = Object.fromEntries(
  LEAD_STATUSES.map((s) => [s, LEAD_STATUS_CONFIG[s].label]),
) as Record<LeadStatus, string>;

export { badgeVariants, columnVariants };
