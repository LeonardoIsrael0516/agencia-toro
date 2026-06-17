const workerEnv: Record<string, string> = {};

const SKIP_ENV_KEYS = new Set(["ASSETS"]);

/** Cloudflare Workers expõe vars/secrets no objeto `env` do fetch. */
export function applyWorkerRuntimeEnv(env: unknown) {
  for (const key of Object.keys(workerEnv)) delete workerEnv[key];
  if (!env || typeof env !== "object") return;

  for (const [key, value] of Object.entries(env as Record<string, unknown>)) {
    if (SKIP_ENV_KEYS.has(key)) continue;
    if (typeof value === "string" && value.trim()) {
      const trimmed = value.trim();
      workerEnv[key] = trimmed;
      process.env[key] = trimmed;
    }
  }
}

export function readWorkerEnv(name: string): string {
  return workerEnv[name] ?? "";
}

type CloudflareWorkerEnv = {
  API_URL?: string;
  LEAD_INGEST_SECRET?: string;
};

/** Lê vars do binding nativo do Cloudflare quando disponível. */
export async function readCloudflareWorkerEnv(): Promise<CloudflareWorkerEnv> {
  try {
    // @ts-expect-error — módulo injetado pelo runtime Cloudflare Workers
    const { env } = await import("cloudflare:workers");
    return env as CloudflareWorkerEnv;
  } catch {
    return {};
  }
}
