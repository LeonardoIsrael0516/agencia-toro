const workerEnv: Record<string, string> = {};

const SKIP_ENV_KEYS = new Set(["ASSETS"]);

type CfEnvGlobal = typeof globalThis & { __CF_ENV__?: unknown };

/** Cloudflare Workers expõe vars/secrets no objeto `env` do fetch. */
export function applyWorkerRuntimeEnv(env: unknown) {
  for (const key of Object.keys(workerEnv)) delete workerEnv[key];
  (globalThis as CfEnvGlobal).__CF_ENV__ = env;

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
  const cf = (globalThis as CfEnvGlobal).__CF_ENV__;
  if (cf && typeof cf === "object" && cf !== null) {
    const value = (cf as Record<string, unknown>)[name];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return workerEnv[name] ?? "";
}
