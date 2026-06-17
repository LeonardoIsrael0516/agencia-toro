import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { handleSubmitLeadRequest } from "@/lib/api/submit-lead-http";

export const Route = createFileRoute("/lead-ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => handleSubmitLeadRequest(request),
    },
  },
});
