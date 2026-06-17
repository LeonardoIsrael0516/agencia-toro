import { config as loadDotenv } from "dotenv";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { readCloudflareWorkerEnv, readWorkerEnv } from "./runtime-env";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
loadDotenv({ path: resolve(siteRoot, ".env") });

function readEnv(name: string): string {
  return readWorkerEnv(name) || (process.env[name] ?? "").trim();
}

function normalizeApiUrl(raw: string): string {
  const url = raw.trim() || "http://127.0.0.1:3333";
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost") parsed.hostname = "127.0.0.1";
    return parsed.origin;
  } catch {
    return "http://127.0.0.1:3333";
  }
}

export async function getServerConfig() {
  const cfEnv = await readCloudflareWorkerEnv();

  const apiUrl = (cfEnv.API_URL?.trim() || readEnv("API_URL")).trim();
  const leadIngestSecret = (cfEnv.LEAD_INGEST_SECRET?.trim() || readEnv("LEAD_INGEST_SECRET")).trim();

  return {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: normalizeApiUrl(apiUrl),
    leadIngestSecret,
  };
}
