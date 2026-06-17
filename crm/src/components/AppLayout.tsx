import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, LogOut, UserCircle, UserCog, Users, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LeadStatusProvider } from "@/hooks/use-lead-status-actions";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <LeadStatusProvider>
      <div className="flex h-dvh overflow-hidden bg-slate-50">
      <aside className="hidden h-dvh w-64 shrink-0 flex-col border-r border-navy/10 bg-navy text-white md:flex">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-cyan">Toró</p>
          <h1 className="mt-1 text-lg font-semibold">CRM Marketing</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              pathname.startsWith("/dashboard")
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/leads"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              pathname.startsWith("/leads")
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <Users className="h-4 w-4" />
            Leads
          </Link>
          <Link
            to="/conta"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              pathname.startsWith("/conta")
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <UserCircle className="h-4 w-4" />
            Minha conta
          </Link>
          {user?.role === "admin" ? (
            <Link
              to="/equipe"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                pathname.startsWith("/equipe")
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <UserCog className="h-4 w-4" />
              Equipe
            </Link>
          ) : null}
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link
            to="/conta"
            className="block truncate text-sm font-medium text-white hover:text-brand-cyan"
          >
            {user?.name}
          </Link>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
            onClick={() => void logout()}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-navy/10 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-brand-blue" />
            <span className="font-semibold text-navy">Toró CRM</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => void logout()}>
            Sair
          </Button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      </div>
    </LeadStatusProvider>
  );
}
