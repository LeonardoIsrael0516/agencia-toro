import type { AuthUser } from "@agencia-toro/shared";
import { SignJWT, jwtVerify } from "jose";

const ACCESS_TTL = "15m";
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export { REFRESH_TTL_MS };

function accessKey(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(user: AuthUser, secret: string) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(accessKey(secret));
}

export type AccessPayload = {
  sub: string;
  email: string;
  name: string;
  role: AuthUser["role"];
};

export async function verifyAccessToken(token: string, secret: string): Promise<AccessPayload> {
  const { payload } = await jwtVerify(token, accessKey(secret));
  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string" ||
    (payload.role !== "admin" && payload.role !== "vendedor")
  ) {
    throw new Error("Invalid token payload");
  }
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

export function toAuthUser(payload: AccessPayload): AuthUser {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

export const REFRESH_COOKIE = "toro_refresh";
