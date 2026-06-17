import process from "node:process";

import { readWorkerEnv } from "./runtime-env";

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

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: normalizeApiUrl(readEnv("API_URL")),
    leadIngestSecret: readEnv("LEAD_INGEST_SECRET"),
  };
}
