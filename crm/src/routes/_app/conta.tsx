import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { changePassword, setAccessToken, updateProfile } from "@/lib/api";

export const Route = createFileRoute("/_app/conta")({
  component: ContaPage,
});

function ContaPage() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setProfileLoading(true);
    try {
      const { accessToken } = await updateProfile({ name: name.trim() });
      setAccessToken(accessToken);
      await refresh();
      setProfileMessage("Perfil atualizado com sucesso.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Erro ao salvar perfil.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("A confirmação da nova senha não confere.");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Senha alterada com sucesso. Outras sessões foram encerradas.");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Erro ao alterar senha.");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Minha conta</h1>
        <p className="mt-1 text-sm text-navy/60">Atualize seu perfil e senha de acesso.</p>
      </div>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/45">Perfil</h2>
        <form onSubmit={onSaveProfile} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Email</label>
            <Input value={user?.email ?? ""} disabled className="bg-slate-50 text-navy/60" />
            <p className="mt-1 text-xs text-navy/45">O email não pode ser alterado por aqui.</p>
          </div>
          {profileError ? <p className="text-sm text-red-600">{profileError}</p> : null}
          {profileMessage ? <p className="text-sm text-emerald-700">{profileMessage}</p> : null}
          <Button type="submit" variant="brand" disabled={profileLoading}>
            {profileLoading ? "Salvando..." : "Salvar perfil"}
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/45">Segurança</h2>
        <form onSubmit={onChangePassword} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Senha atual</label>
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Nova senha</label>
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-navy/45">Mínimo 8 caracteres, com letra e número.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Confirmar nova senha</label>
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
          {passwordMessage ? <p className="text-sm text-emerald-700">{passwordMessage}</p> : null}
          <Button type="submit" variant="brand" disabled={passwordLoading}>
            {passwordLoading ? "Alterando..." : "Alterar senha"}
          </Button>
        </form>
      </section>
    </div>
  );
}
