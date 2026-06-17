import { eq } from "drizzle-orm";

import { loadEnv } from "./config.js";
import { getDb } from "./db/index.js";
import { users } from "./db/schema.js";
import { hashPassword } from "./lib/crypto.js";

async function seed() {
  const env = loadEnv();
  const db = getDb(env.DATABASE_URL);

  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required for seeding");
    process.exit(1);
  }

  const email = env.ADMIN_EMAIL.toLowerCase();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
  await db.insert(users).values({
    email,
    name: "Administrador",
    passwordHash,
    role: "admin",
  });

  console.log(`Admin created: ${email}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
