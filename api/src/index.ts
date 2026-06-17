import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";

import { getCorsOrigins, loadEnv, type Env } from "./config.js";
import { authRoutes } from "./routes/auth.js";
import { leadsRoutes } from "./routes/leads.js";
import { publicLeadsRoutes } from "./routes/public-leads.js";

declare module "fastify" {
  interface FastifyInstance {
    config: Env;
  }
}

async function main() {
  const env = loadEnv();
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
    trustProxy: true,
  });

  app.decorate("config", env);

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: getCorsOrigins(env),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Lead-Secret"],
  });
  await app.register(cookie);
  await app.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: "1 minute",
  });

  app.get("/health", async () => ({ ok: true }));

  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(publicLeadsRoutes, { prefix: "/api/public/leads" });
  await app.register(leadsRoutes, { prefix: "/api/leads" });

  const port = env.PORT;
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`API listening on http://localhost:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
