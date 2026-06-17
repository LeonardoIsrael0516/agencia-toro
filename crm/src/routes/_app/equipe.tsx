import type { UserRecord, UserRole } from "@agencia-toro/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { KeyRound, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import {
  adminSetUserPassword,
  AuthError,
  createUser,
  fetchUsers,
  updateUser,
} from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";

export const Route = createFileRoute("/_app/equipe")({
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role !== "admin") {
      throw redirect({ to: "/leads" });
    }
  },
  component: EquipePage,
});

type ModalKind = "create" | "edit" | "password" | null;

function EquipePage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalKind>(null);
  const [selected, setSelected] = useState<UserRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      void invalidate();
      setModal(null);
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Erro ao criar usuário"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, patch),
    onSuccess: () => {
      void invalidate();
      setModal(null);
      setSelected(null);
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Erro ao atualizar usuário"),
  });

  const passwordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      adminSetUserPassword(id, password),
    onSuccess: () => {
      void invalidate();
      setModal(null);
      setSelected(null);
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Erro ao redefinir senha"),
  });

  if (query.isError && query.error instanceof AuthError) {
    void logout();
  }

  const items = query.data?.items ?? [];
  const activeAdmins = items.filter((u) => u.role === "admin" && u.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Equipe</h1>
          <p className="mt-1 text-sm text-navy/60">Gerencie quem tem acesso ao CRM.</p>
        </div>
        <Button variant="brand" onClick={() => { setModal("create"); setError(null); }}>
          <Plus className="h-4 w-4" />
          Adicionar membro
        </Button>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-navy/50">Carregando equipe...</p>
      ) : query.isError ? (
        <p className="text-sm text-red-600">Erro ao carregar equipe.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-navy/10 bg-slate-50 text-xs uppercase tracking-wide text-navy/50">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Perfil</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Cadastro</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((member) => {
                const isSelf = member.id === user?.id;
                const isOnlyAdmin = member.role === "admin" && member.active && activeAdmins <= 1;

                return (
                  <tr key={member.id} className="border-b border-navy/5 hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium">
                      {member.name}
                      {isSelf ? (
                        <span className="ml-2 rounded-full bg-brand-cyan/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-blue">
                          Você
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">{roleLabel(member.role)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          member.active
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-slate-100 text-navy/50",
                        )}
                      >
                        {member.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy/60">{formatDate(member.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelected(member);
                            setModal("edit");
                            setError(null);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelected(member);
                            setModal("password");
                            setError(null);
                          }}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          Senha
                        </Button>
                        {isOnlyAdmin && isSelf ? (
                          <span className="self-center text-[11px] text-navy/45">Único admin</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal === "create" ? (
        <CreateUserModal
          loading={createMutation.isPending}
          error={error}
          onClose={() => setModal(null)}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      ) : null}

      {modal === "edit" && selected ? (
        <EditUserModal
          user={selected}
          isOnlyAdmin={selected.role === "admin" && selected.active && activeAdmins <= 1}
          isSelf={selected.id === user?.id}
          loading={updateMutation.isPending}
          error={error}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
          onSubmit={(patch) => updateMutation.mutate({ id: selected.id, patch })}
        />
      ) : null}

      {modal === "password" && selected ? (
        <ResetPasswordModal
          userName={selected.name}
          loading={passwordMutation.isPending}
          error={error}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
          onSubmit={(password) => passwordMutation.mutate({ id: selected.id, password })}
        />
      ) : null}
    </div>
  );
}

function roleLabel(role: UserRole) {
  return role === "admin" ? "Administrador" : "Vendedor";
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-navy/45 hover:text-navy"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CreateUserModal({
  loading,
  error,
  onClose,
  onSubmit,
}: {
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("vendedor");

  return (
    <ModalShell title="Adicionar membro" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name: name.trim(), email: email.trim(), password, role });
        }}
      >
        <Field label="Nome" value={name} onChange={setName} required />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field label="Senha inicial" type="password" value={password} onChange={setPassword} required minLength={8} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Perfil</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="h-10 w-full rounded-lg border border-navy/15 px-3 text-sm"
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        {error ? <p className="text-sm text-red-600">{formatApiError(error)}</p> : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="brand" disabled={loading}>
            {loading ? "Criando..." : "Criar membro"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

function EditUserModal({
  user,
  isOnlyAdmin,
  isSelf,
  loading,
  error,
  onClose,
  onSubmit,
}: {
  user: UserRecord;
  isOnlyAdmin: boolean;
  isSelf: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (patch: { name?: string; role?: UserRole; active?: boolean }) => void;
}) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [active, setActive] = useState(user.active);

  return (
    <ModalShell title="Editar membro" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name: name.trim(), role, active });
        }}
      >
        <Field label="Nome" value={name} onChange={setName} required />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Email</label>
          <Input value={user.email} disabled className="bg-slate-50 text-navy/60" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Perfil</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={isOnlyAdmin && isSelf}
            className="h-10 w-full rounded-lg border border-navy/15 px-3 text-sm disabled:bg-slate-50"
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            disabled={isOnlyAdmin && isSelf}
          />
          Usuário ativo
        </label>
        {isOnlyAdmin && isSelf ? (
          <p className="text-xs text-navy/45">
            Você é o único administrador ativo. Não é possível se desativar ou rebaixar.
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="brand" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

function ResetPasswordModal({
  userName,
  loading,
  error,
  onClose,
  onSubmit,
}: {
  userName: string;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <ModalShell title="Redefinir senha" onClose={onClose}>
      <p className="mb-4 text-sm text-navy/60">
        Defina uma nova senha para <strong>{userName}</strong>. Todas as sessões ativas serão encerradas.
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setLocalError(null);
          if (password !== confirm) {
            setLocalError("A confirmação da senha não confere.");
            return;
          }
          onSubmit(password);
        }}
      >
        <Field label="Nova senha" type="password" value={password} onChange={setPassword} required minLength={8} />
        <Field label="Confirmar senha" type="password" value={confirm} onChange={setConfirm} required minLength={8} />
        {localError ? <p className="text-sm text-red-600">{localError}</p> : null}
        {error ? <p className="text-sm text-red-600">{formatApiError(error)}</p> : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="brand" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir senha"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
      />
    </div>
  );
}

function formatApiError(error: string) {
  if (error.startsWith("{")) {
    try {
      const parsed = JSON.parse(error) as { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
      const fieldMsgs = Object.values(parsed.fieldErrors ?? {}).flat();
      if (fieldMsgs.length) return fieldMsgs.join(" ");
    } catch {
      /* ignore */
    }
  }
  return error;
}
