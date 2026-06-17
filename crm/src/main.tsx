import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider, useAuth } from "./lib/auth-context";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.name === "AuthError") return false;
        return failureCount < 1;
      },
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    auth: {
      user: null,
      loading: false,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AuthBootScreen() {
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-navy/15 border-t-brand-blue" />
        <p className="mt-4 text-sm text-navy/55">Carregando sessão..</p>
      </div>
    </div>
  );
}

function AppRouter() {
  const auth = useAuth();

  if (auth.loading) {
    return <AuthBootScreen />;
  }

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          user: auth.user,
          loading: false,
        },
      }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider router={router}>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
