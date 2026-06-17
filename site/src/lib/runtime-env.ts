const workerEnv: Record<string, string> = {};

const SKIP_ENV_KEYS = new Set(["ASSETS"]);

type CfEnvGlobal = typeof globalThis & { __CF_ENV__?: unknown; __env__?: unknown };

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

function readFromEnvObject(env: unknown, name: string): string {
  if (!env || typeof env !== "object") return "";
  const value = (env as Record<string, unknown>)[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function readWorkerEnv(name: string): string {
  const fromCache = workerEnv[name];
  if (fromCache) return fromCache;

  const cf = (globalThis as CfEnvGlobal).__CF_ENV__;
  const fromCf = readFromEnvObject(cf, name);
  if (fromCf) return fromCf;

  const nitro = (globalThis as CfEnvGlobal).__env__;
  const fromNitro = readFromEnvObject(nitro, name);
  if (fromNitro) return fromNitro;

  return "";
}
