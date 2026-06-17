import type { AuthUser } from "@agencia-toro/shared";
import type { AnyRouter } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import {
  clearSession,
  fetchMe,
  login as apiLogin,
  logout as apiLogout,
  restoreSession,
} from "./api";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({
  children,
  router,
}: {
  children: ReactNode;
  router: AnyRouter;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const booted = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const ok = await restoreSession();
      if (!ok) {
        clearSession();
        setUser(null);
        return;
      }
      const { user: me } = await fetchMe();
      setUser(me);
    } catch {
      clearSession();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    void (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
      await router.invalidate();
    })();
  }, [refresh, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: loggedIn } = await apiLogin(email, password);
      flushSync(() => {
        setUser(loggedIn);
      });
      await router.navigate({ to: "/dashboard" });
      await router.invalidate();
    },
    [router],
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    await router.navigate({ to: "/login" });
    await router.invalidate();
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, logout, refresh }),
    [user, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
