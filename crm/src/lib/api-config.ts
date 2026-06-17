const DEFAULT_DEV_API_URL = "http://127.0.0.1:3333";

let apiUrl = (import.meta.env.VITE_API_URL?.trim() || DEFAULT_DEV_API_URL).replace(/\/$/, "");

export function getApiUrl() {
  return apiUrl;
}

export function setApiUrl(url: string) {
  apiUrl = url.trim().replace(/\/$/, "");
}

export async function loadApiConfig() {
  try {
    const res = await fetch(`/runtime-config.json?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { apiUrl?: string };
    if (data.apiUrl?.trim()) {
      setApiUrl(data.apiUrl);
    }
  } catch {
    /* Vite dev / preview sem worker */
  }
}
