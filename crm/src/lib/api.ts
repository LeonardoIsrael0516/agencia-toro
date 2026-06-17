import type {
  AuthUser,
  CreateUserInput,
  LeadDashboardStats,
  LeadRecord,
  LeadStatus,
  PaginatedLeads,
  UpdateProfileInput,
  UpdateUserInput,
  UserListResponse,
  UserRecord,
} from "@agencia-toro/shared";

import { getApiUrl } from "./api-config";

const TOKEN_STORAGE_KEY = "toro_crm_access_token";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

function readStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    else sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

accessToken = readStoredToken();

export function setAccessToken(token: string | null) {
  accessToken = token;
  writeStoredToken(token);
}

export function getAccessToken() {
  return accessToken;
}

function formatApiErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const e = error as { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
    const parts = [...(e.formErrors ?? []), ...Object.values(e.fieldErrors ?? {}).flat()];
    if (parts.length) return parts.join(" ");
    if ("message" in error && typeof (error as { message: unknown }).message === "string") {
      return (error as { message: string }).message;
    }
  }
  return "Request failed";
}

export function clearSession() {
  setAccessToken(null);
}

export class AuthError extends Error {
  constructor(message = "Sessão expirada") {
    super(message);
    this.name = "AuthError";
  }
}

/** Single-flight refresh — evita rotação dupla que invalida a sessão (ex.: React StrictMode). */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        clearSession();
        return null;
      }
      const data = (await res.json()) as { accessToken: string };
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function restoreSession(): Promise<boolean> {
  if (!getAccessToken()) {
    return !!(await refreshAccessToken());
  }

  try {
    await fetchMe();
    return true;
  } catch {
    clearSession();
    return !!(await refreshAccessToken());
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${getApiUrl()}${path}`, {
        ...init,
        headers,
        credentials: "include",
      });
    }
  }

  if (res.status === 401) {
    clearSession();
    throw new AuthError();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    const message = formatApiErrorMessage(err.error ?? err.message ?? err);
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${getApiUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(typeof err.error === "string" ? err.error : "Login failed");
  }

  const data = (await res.json()) as { accessToken: string; user: AuthUser };
  setAccessToken(data.accessToken);
  return data;
}

export async function logout() {
  try {
    await fetch(`${getApiUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearSession();
  }
}

export async function fetchMe() {
  return apiFetch<{ user: AuthUser }>("/api/auth/me");
}

export async function fetchLeadStats() {
  return apiFetch<LeadDashboardStats>("/api/leads/stats");
}

export async function fetchLeads(params: {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: LeadStatus;
}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.q) search.set("q", params.q);
  if (params.status) search.set("status", params.status);
  const qs = search.toString();
  return apiFetch<PaginatedLeads>(`/api/leads${qs ? `?${qs}` : ""}`);
}

export async function fetchLead(id: string) {
  return apiFetch<LeadRecord>(`/api/leads/${id}`);
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return apiFetch<LeadRecord>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateProfile(input: UpdateProfileInput) {
  return apiFetch<{ user: AuthUser; accessToken: string }>("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  return apiFetch<{ ok: true }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchUsers() {
  return apiFetch<UserListResponse>("/api/auth/users");
}

export async function createUser(input: CreateUserInput) {
  return apiFetch<{ user: UserRecord }>("/api/auth/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateUser(id: string, input: UpdateUserInput) {
  return apiFetch<{ user: UserRecord }>(`/api/auth/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function adminSetUserPassword(id: string, password: string) {
  return apiFetch<{ ok: true }>(`/api/auth/users/${id}/password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}
