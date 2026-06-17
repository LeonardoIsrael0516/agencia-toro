import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

const rawUrl = process.env.DATABASE_URL ?? "file:./data/dev.sqlite";
const isSqlite = rawUrl.startsWith("file:");
const sqlitePath = isSqlite
  ? resolve(process.cwd(), rawUrl.replace(/^file:/, ""))
  : undefined;

if (sqlitePath) {
  mkdirSync(dirname(sqlitePath), { recursive: true });
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: isSqlite ? "sqlite" : "mysql",
  dbCredentials: isSqlite ? { url: sqlitePath! } : { url: rawUrl },
});
