import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiUrl = (process.env.VITE_API_URL ?? process.env.API_URL ?? "").trim().replace(/\/$/, "");

writeFileSync(
  path.join(root, "public/runtime-config.json"),
  `${JSON.stringify({ apiUrl }, null, 2)}\n`,
  "utf8",
);

if (!apiUrl) {
  console.warn(
    "[crm] VITE_API_URL/API_URL nao definida no build — em producao use a variavel API_URL no Worker (runtime).",
  );
} else {
  console.log(`[crm] runtime-config.json gerado com apiUrl=${apiUrl}`);
}
