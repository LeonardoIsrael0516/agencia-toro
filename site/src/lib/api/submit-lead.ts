import { createServerFn } from "@tanstack/react-start";

import { ingestLeadToApi, parseSubmitLeadBody } from "./submit-lead-core";

/** Mantido para dev; em producao o formulario usa /lead-ingest via fetch. */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(parseSubmitLeadBody)
  .handler(async ({ data }) => ingestLeadToApi(data));
