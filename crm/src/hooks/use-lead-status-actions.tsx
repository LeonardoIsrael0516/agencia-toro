import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import type { LeadRecord, LeadStatus, PaginatedLeads } from "@agencia-toro/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLeadStatus } from "@/lib/api";

type UpdateVars = { id: string; status: LeadStatus; version: number };

type LeadStatusActions = {
  updateStatus: (id: string, status: LeadStatus) => void;
  isLeadUpdating: (id: string) => boolean;
  draggingLeadId: string | null;
  setDraggingLeadId: (id: string | null) => void;
};

const LeadStatusActionsContext = createContext<LeadStatusActions | null>(null);

function patchLeadInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  status: LeadStatus,
  serverLead?: LeadRecord,
) {
  const patch = (lead: LeadRecord): LeadRecord => {
    if (lead.id !== id) return lead;
    if (serverLead) return serverLead;
    return { ...lead, status, updatedAt: new Date().toISOString() };
  };

  queryClient.setQueriesData<PaginatedLeads>({ queryKey: ["leads"] }, (old) => {
    if (!old) return old;
    return { ...old, items: old.items.map(patch) };
  });

  queryClient.setQueryData<LeadRecord>(["lead", id], (old) => (old ? patch(old) : old));
}

export function LeadStatusProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(() => new Set());

  const versionRef = useRef(new Map<string, number>());
  const queueRef = useRef(new Map<string, Promise<void>>());

  const mutation = useMutation({
    mutationFn: ({ id, status }: UpdateVars) => updateLeadStatus(id, status),
    onMutate: async ({ id, status, version }) => {
      setUpdatingIds((prev) => new Set(prev).add(id));

      const listSnapshots = queryClient.getQueriesData<PaginatedLeads>({ queryKey: ["leads"] });
      const leadSnapshot = queryClient.getQueryData<LeadRecord>(["lead", id]);

      patchLeadInCache(queryClient, id, status);

      return { version, listSnapshots, leadSnapshot };
    },
    onError: (err, { id, version }, ctx) => {
      console.error("[CRM] Falha ao atualizar etapa:", err);
      if (versionRef.current.get(id) !== version) return;
      ctx?.listSnapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (ctx?.leadSnapshot !== undefined) {
        queryClient.setQueryData(["lead", id], ctx.leadSnapshot);
      }
    },
    onSuccess: (updated, { id, version }) => {
      if (versionRef.current.get(id) !== version) return;
      patchLeadInCache(queryClient, id, updated.status, updated);
    },
    onSettled: (_data, _err, { id, version }) => {
      if (versionRef.current.get(id) === version) {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
  });

  const updateStatus = useCallback(
    (id: string, status: LeadStatus) => {
      const current = queryClient
        .getQueriesData<PaginatedLeads>({ queryKey: ["leads"] })
        .flatMap(([, data]) => data?.items ?? [])
        .find((l) => l.id === id);

      const detail = queryClient.getQueryData<LeadRecord>(["lead", id]);
      const knownStatus = current?.status ?? detail?.status;
      if (knownStatus === status) return;

      const version = (versionRef.current.get(id) ?? 0) + 1;
      versionRef.current.set(id, version);

      const prev = queueRef.current.get(id) ?? Promise.resolve();
      const run = prev
        .catch(() => undefined)
        .then(() => mutation.mutateAsync({ id, status, version }));

      queueRef.current.set(id, run.then(() => undefined));

      void run.catch((err) => {
        console.error("[CRM] updateStatus:", err);
      });
    },
    [mutation, queryClient],
  );

  const isLeadUpdating = useCallback((id: string) => updatingIds.has(id), [updatingIds]);

  const value: LeadStatusActions = {
    updateStatus,
    isLeadUpdating,
    draggingLeadId,
    setDraggingLeadId,
  };

  return (
    <LeadStatusActionsContext.Provider value={value}>{children}</LeadStatusActionsContext.Provider>
  );
}

export function useLeadStatusActions() {
  const ctx = useContext(LeadStatusActionsContext);
  if (!ctx) throw new Error("useLeadStatusActions must be used within LeadStatusProvider");
  return ctx;
}

export function setDraggedLead(e: DragEvent, leadId: string) {
  e.dataTransfer.setData("text/plain", leadId);
  e.dataTransfer.effectAllowed = "move";
}

export function readDraggedLeadId(e: DragEvent, fallbackId: string | null): string | null {
  return e.dataTransfer.getData("text/plain") || fallbackId;
}
