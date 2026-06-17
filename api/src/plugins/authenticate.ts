import type { FastifyReply, FastifyRequest } from "fastify";

import type { Env } from "../config.js";
import { toAuthUser, verifyAccessToken, type AccessPayload } from "../lib/auth-tokens.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: AccessPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  const token = header.slice(7);
  const env = request.server.config as Env;

  try {
    request.user = await verifyAccessToken(token, env.JWT_ACCESS_SECRET);
  } catch {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: AccessPayload["role"][]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return reply.code(403).send({ error: "Forbidden" });
    }
  };
}

export function getAuthUser(request: FastifyRequest) {
  if (!request.user) throw new Error("Missing authenticated user");
  return toAuthUser(request.user);
}
