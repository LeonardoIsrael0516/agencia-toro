const SERVER_ENV_KEYS = ["API_URL", "LEAD_INGEST_SECRET", "NODE_ENV"] as const;

/** Cloudflare Workers expõe vars no objeto `env` do fetch — sincroniza com process.env. */
export function applyWorkerRuntimeEnv(env: unknown) {
  if (!env || typeof env !== "object") return;

  const record = env as Record<string, unknown>;
  for (const key of SERVER_ENV_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      process.env[key] = value.trim();
    }
  }
}
