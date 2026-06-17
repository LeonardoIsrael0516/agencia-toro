import { ZodError } from "zod";

import { ingestLeadToApi, parseSubmitLeadBody, SubmitLeadError } from "./submit-lead-core";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export async function handleSubmitLeadRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  try {
    const body = await request.json();
    const data = parseSubmitLeadBody(body);
    await ingestLeadToApi(data);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    if (error instanceof SubmitLeadError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: JSON_HEADERS,
      });
    }

    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: "Revise os dados do formulário e tente novamente." }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    console.error("[submit-lead-http]", error);
    return new Response(
      JSON.stringify({ error: "Não foi possível enviar sua solicitação. Tente novamente em instantes." }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
}
