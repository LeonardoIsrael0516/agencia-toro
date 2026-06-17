import { desc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import type { Env } from "../config.js";
import { getDb } from "../db/index.js";
import { sessions, users } from "../db/schema.js";
import {
  REFRESH_COOKIE,
  REFRESH_TTL_MS,
  signAccessToken,
  toAuthUser,
} from "../lib/auth-tokens.js";
import { generateRefreshToken, hashPassword, hashToken, verifyPassword } from "../lib/crypto.js";
import {
  assertCanModifyUser,
  findSessionIdByRefreshToken,
  mapUserRecord,
  revokeAllUserSessions,
  UserGuardError,
} from "../lib/user-guards.js";
import { authenticate, getAuthUser, requireRole } from "../plugins/authenticate.js";
import {
  adminSetPasswordSchema,
  changePasswordSchema,
  createUserSchema,
  loginSchema,
  updateProfileSchema,
  updateUserSchema,
} from "@agencia-toro/shared";

function refreshCookieOptions(env: Env) {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE ?? isProd,
    sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
    path: "/",
    maxAge: REFRESH_TTL_MS / 1000,
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

function clearRefreshCookie(reply: { clearCookie: (name: string, options?: object) => void }, env: Env) {
  reply.clearCookie(REFRESH_COOKIE, {
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  });
}

function userSelectFields() {
  return {
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
    active: users.active,
    createdAt: users.createdAt,
  };
}

export async function authRoutes(app: FastifyInstance) {
  const env = app.config as Env;
  const db = getDb(env.DATABASE_URL);

  app.post("/login", {
    config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    handler: async (request, reply) => {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Invalid credentials" });
      }

      const { email, password } = parsed.data;
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

      if (!user?.active) {
        return reply.code(401).send({ error: "Email ou senha incorretos" });
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return reply.code(401).send({ error: "Email ou senha incorretos" });
      }

      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "admin" | "vendedor",
      };

      const accessToken = await signAccessToken(authUser, env.JWT_ACCESS_SECRET);
      const refreshToken = generateRefreshToken();
      const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

      await db.insert(sessions).values({
        userId: user.id,
        refreshTokenHash: hashToken(refreshToken),
        expiresAt,
        userAgent: request.headers["user-agent"] ?? null,
        ip: request.ip,
      });

      reply.setCookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions(env));
      return { accessToken, user: authUser };
    },
  });

  app.post("/refresh", {
    handler: async (request, reply) => {
      const refreshToken = request.cookies[REFRESH_COOKIE];
      if (!refreshToken) {
        return reply.code(401).send({ error: "Session expired" });
      }

      const tokenHash = hashToken(refreshToken);
      const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.refreshTokenHash, tokenHash))
        .limit(1);

      if (!session || session.revokedAt || session.expiresAt.getTime() < Date.now()) {
        clearRefreshCookie(reply, env);
        return reply.code(401).send({ error: "Session expired" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
      if (!user?.active) {
        return reply.code(401).send({ error: "Session expired" });
      }

      await db
        .update(sessions)
        .set({ revokedAt: new Date() })
        .where(eq(sessions.id, session.id));

      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "admin" | "vendedor",
      };

      const accessToken = await signAccessToken(authUser, env.JWT_ACCESS_SECRET);
      const newRefreshToken = generateRefreshToken();
      const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

      await db.insert(sessions).values({
        userId: user.id,
        refreshTokenHash: hashToken(newRefreshToken),
        expiresAt,
        userAgent: request.headers["user-agent"] ?? null,
        ip: request.ip,
      });

      reply.setCookie(REFRESH_COOKIE, newRefreshToken, refreshCookieOptions(env));
      return { accessToken };
    },
  });

  app.post("/logout", {
    handler: async (request, reply) => {
      const refreshToken = request.cookies[REFRESH_COOKIE];
      if (refreshToken) {
        const tokenHash = hashToken(refreshToken);
        await db
          .update(sessions)
          .set({ revokedAt: new Date() })
          .where(eq(sessions.refreshTokenHash, tokenHash));
      }
      clearRefreshCookie(reply, env);
      return { ok: true };
    },
  });

  app.get(
    "/me",
    { preHandler: authenticate },
    async (request) => {
      return { user: getAuthUser(request) };
    },
  );

  app.patch(
    "/me",
    { preHandler: authenticate },
    async (request, reply) => {
      const parsed = updateProfileSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      const authUser = getAuthUser(request);
      const [updated] = await db
        .update(users)
        .set({ name: parsed.data.name })
        .where(eq(users.id, authUser.id))
        .returning(userSelectFields());

      if (!updated) {
        return reply.code(404).send({ error: "Usuário não encontrado" });
      }

      const user = mapUserRecord(updated);
      const accessToken = await signAccessToken(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        env.JWT_ACCESS_SECRET,
      );

      return { user, accessToken };
    },
  );

  app.post(
    "/change-password",
    {
      preHandler: authenticate,
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const parsed = changePasswordSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      const authUser = getAuthUser(request);
      const [user] = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
      if (!user?.active) {
        return reply.code(401).send({ error: "Sessão inválida" });
      }

      const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
      if (!valid) {
        return reply.code(400).send({ error: "Senha atual incorreta" });
      }

      const passwordHash = await hashPassword(parsed.data.newPassword);
      await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

      const refreshToken = request.cookies[REFRESH_COOKIE];
      const currentSessionId = refreshToken
        ? await findSessionIdByRefreshToken(db, refreshToken)
        : undefined;
      await revokeAllUserSessions(db, user.id, currentSessionId);

      return { ok: true };
    },
  );

  app.get(
    "/users",
    { preHandler: [authenticate, requireRole("admin")] },
    async () => {
      const rows = await db
        .select(userSelectFields())
        .from(users)
        .orderBy(desc(users.createdAt));

      return { items: rows.map(mapUserRecord) };
    },
  );

  app.post(
    "/users",
    { preHandler: [authenticate, requireRole("admin")] },
    async (request, reply) => {
      const parsed = createUserSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      const { email, name, password, role } = parsed.data;
      const passwordHash = await hashPassword(password);

      try {
        const [created] = await db
          .insert(users)
          .values({
            email: email.toLowerCase(),
            name,
            passwordHash,
            role,
          })
          .returning(userSelectFields());

        return reply.code(201).send({ user: mapUserRecord(created!) });
      } catch {
        return reply.code(409).send({ error: "Email já cadastrado" });
      }
    },
  );

  app.patch(
    "/users/:id",
    {
      preHandler: [authenticate, requireRole("admin")],
      config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = updateUserSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!target) {
        return reply.code(404).send({ error: "Usuário não encontrado" });
      }

      const actor = getAuthUser(request);
      try {
        await assertCanModifyUser({
          db,
          actorId: actor.id,
          targetId: target.id,
          targetRole: target.role as "admin" | "vendedor",
          targetActive: target.active,
          patch: parsed.data,
        });
      } catch (err) {
        if (err instanceof UserGuardError) {
          return reply.code(err.statusCode).send({ error: err.message });
        }
        throw err;
      }

      const patch: Partial<{ name: string; role: string; active: boolean }> = {};
      if (parsed.data.name !== undefined) patch.name = parsed.data.name;
      if (parsed.data.role !== undefined) patch.role = parsed.data.role;
      if (parsed.data.active !== undefined) patch.active = parsed.data.active;

      const [updated] = await db
        .update(users)
        .set(patch)
        .where(eq(users.id, id))
        .returning(userSelectFields());

      return { user: mapUserRecord(updated!) };
    },
  );

  app.post(
    "/users/:id/password",
    {
      preHandler: [authenticate, requireRole("admin")],
      config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = adminSetPasswordSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!target) {
        return reply.code(404).send({ error: "Usuário não encontrado" });
      }

      const passwordHash = await hashPassword(parsed.data.password);
      await db.update(users).set({ passwordHash }).where(eq(users.id, id));
      await revokeAllUserSessions(db, id);

      return { ok: true };
    },
  );
}
