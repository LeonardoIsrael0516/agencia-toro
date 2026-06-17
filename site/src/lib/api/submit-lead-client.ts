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

  const json = (await res.json().catch(() => ({}))) as {
    error?: string | boolean;
    ok?: boolean;
    unhandled?: boolean;
  };

  if (!res.ok) {
    const message =
      typeof json.error === "string" && json.error.trim()
        ? json.error
        : json.unhandled || json.error === true
          ? "Não foi possível enviar sua solicitação. Tente novamente em instantes."
          : "Não foi possível enviar sua solicitação. Tente novamente em instantes.";
    throw new Error(message);
  }

  return { ok: true };
}
