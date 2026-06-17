import type { SubmitLeadInput } from "./submit-lead-core";

export async function submitLeadFromClient(data: SubmitLeadInput): Promise<{ ok: true }> {
  const res = await fetch("/lead-ingest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };

  if (!res.ok) {
    throw new Error(
      typeof json.error === "string" && json.error.trim()
        ? json.error
        : "Não foi possível enviar sua solicitação. Tente novamente em instantes.",
    );
  }

  return { ok: true };
}
