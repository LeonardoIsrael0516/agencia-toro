import { hash, verify } from "@node-rs/argon2";
import { createHash, randomBytes } from "node:crypto";

export async function hashPassword(password: string) {
  return hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyPassword(password: string, passwordHash: string) {
  return verify(passwordHash, password);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateRefreshToken() {
  return randomBytes(32).toString("hex");
}
