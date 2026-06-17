import { createMiddleware } from "@tanstack/react-start";

import { applyWorkerRuntimeEnv } from "./runtime-env";

function resolveCloudflareEnv(context: unknown): unknown {
  if (!context || typeof context !== "object") return undefined;

  const record = context as Record<string, unknown>;
  const cloudflare = record.cloudflare;
  if (cloudflare && typeof cloudflare === "object") {
    const env = (cloudflare as Record<string, unknown>).env;
    if (env && typeof env === "object") return env;
  }

  if (record.env && typeof record.env === "object") return record.env;
  return undefined;
}

/** Garante API_URL e LEAD_INGEST_SECRET do binding Cloudflare em server routes e server fns. */
export const workerEnvMiddleware = createMiddleware().server(async ({ context, next }) => {
  const env = resolveCloudflareEnv(context);
  if (env) applyWorkerRuntimeEnv(env);
  return next();
});
