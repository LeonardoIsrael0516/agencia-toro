import { and, count, eq, isNull, ne } from "drizzle-orm";

import type { UserRole } from "@agencia-toro/shared";
import type { getDb } from "../db/index.js";
import { sessions, users } from "../db/schema.js";
import { hashToken } from "./crypto.js";

type Db = ReturnType<typeof getDb>;

export async function countActiveAdmins(db: Db) {
  const [row] = await db
    .select({ value: count() })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.active, true)));
  return row?.value ?? 0;
}

type ModifyUserPatch = {
  role?: UserRole;
  active?: boolean;
};

export class UserGuardError extends Error {
  statusCode = 403 as const;

  constructor(message: string) {
    super(message);
    this.name = "UserGuardError";
  }
}

export async function assertCanModifyUser(opts: {
  db: Db;
  actorId: string;
  targetId: string;
  targetRole: UserRole;
  targetActive: boolean;
  patch: ModifyUserPatch;
}) {
  const { db, actorId, targetId, targetRole, targetActive, patch } = opts;
  const nextRole = patch.role ?? targetRole;
  const nextActive = patch.active ?? targetActive;

  const demotingAdmin = targetRole === "admin" && nextRole !== "admin";
  const deactivating = targetActive && !nextActive;
  const affectsAdminCapacity = demotingAdmin || deactivating;

  if (!affectsAdminCapacity) return;

  if (targetRole === "admin") {
    const activeAdmins = await countActiveAdmins(db);
    const isSelf = actorId === targetId;

    if (activeAdmins <= 1 && (demotingAdmin || deactivating)) {
      if (isSelf) {
        throw new UserGuardError("Você é o único administrador ativo e não pode ser desativado ou rebaixado.");
      }
      throw new UserGuardError("Não é possível remover o único administrador ativo do sistema.");
    }
  }
}

export async function revokeAllUserSessions(db: Db, userId: string, exceptSessionId?: string) {
  const now = new Date();
  if (exceptSessionId) {
    await db
      .update(sessions)
      .set({ revokedAt: now })
      .where(
        and(
          eq(sessions.userId, userId),
          isNull(sessions.revokedAt),
          ne(sessions.id, exceptSessionId),
        ),
      );
    return;
  }

  await db
    .update(sessions)
    .set({ revokedAt: now })
    .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
}

export async function findSessionIdByRefreshToken(db: Db, refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  const [session] = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.refreshTokenHash, tokenHash))
    .limit(1);
  return session?.id;
}

export function mapUserRecord(row: {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: Date;
}) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as UserRole,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
  };
}
