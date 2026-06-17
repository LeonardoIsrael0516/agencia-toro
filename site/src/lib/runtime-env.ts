import process from "node:process";

const workerEnv: Record<string, string> = {};

const SKIP_ENV_KEYS = new Set(["ASSETS"]);

const KNOWN_ENV_KEYS = ["API_URL", "LEAD_INGEST_SECRET"] as const;

type CfEnvGlobal = typeof globalThis & { __CF_ENV__?: unknown; __env__?: unknown };

function resolveEnvSource(env: unknown): Record<string, unknown> | null {
  if (env && typeof env === "object") return env as Record<string, unknown>;

  const nitro = (globalThis as CfEnvGlobal).__env__;
  if (nitro && typeof nitro === "object") return nitro as Record<string, unknown>;

  return null;
}

function readFromEnvObject(env: unknown, name: string): string {
  if (!env || typeof env !== "object") return "";
  const value = (env as Record<string, unknown>)[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

/** Cloudflare Workers expõe vars/secrets no objeto `env` do fetch. */
export function applyWorkerRuntimeEnv(env: unknown) {
  const source = resolveEnvSource(env);
  if (!source) return;

  (globalThis as CfEnvGlobal).__CF_ENV__ = source;

  for (const key of Object.keys(workerEnv)) delete workerEnv[key];

  for (const key of KNOWN_ENV_KEYS) {
    const value = readFromEnvObject(source, key);
    if (value) {
      workerEnv[key] = value;
      process.env[key] = value;
    }
  }

  for (const [key, value] of Object.entries(source)) {
    if (SKIP_ENV_KEYS.has(key)) continue;
    if (typeof value === "string" && value.trim()) {
      const trimmed = value.trim();
      workerEnv[key] = trimmed;
      process.env[key] = trimmed;
    }
  }
}

export function readWorkerEnv(name: string): string {
  const fromCache = workerEnv[name];
  if (fromCache) return fromCache;

  const nitro = (globalThis as CfEnvGlobal).__env__;
  const fromNitro = readFromEnvObject(nitro, name);
  if (fromNitro) return fromNitro;

  const cf = (globalThis as CfEnvGlobal).__CF_ENV__;
  const fromCf = readFromEnvObject(cf, name);
  if (fromCf) return fromCf;

  return "";
}

export function listWorkerEnvKeys(): string[] {
  const source = resolveEnvSource((globalThis as CfEnvGlobal).__CF_ENV__) ?? resolveEnvSource(null);
  if (!source) return [];
  return Object.keys(source).filter((key) => !SKIP_ENV_KEYS.has(key));
}
