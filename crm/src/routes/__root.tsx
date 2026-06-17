import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";

import type { AuthState } from "@/lib/auth-types";

export type RouterContext = {
  auth: AuthState;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;
    if (!auth) return;

    const isLogin = location.pathname === "/login";
    if (!auth.user && !isLogin) {
      throw redirect({ to: "/login" });
    }
    if (auth.user && isLogin) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});
