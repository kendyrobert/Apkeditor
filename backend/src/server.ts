import Fastify from "fastify";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import fstatic from "@fastify/static";
import { resolve } from "node:path";
import { config } from "./config.js";
import { migrate } from "./db/pool.js";
import { projectRoutes } from "./routes/projects.js";

const app = Fastify({ logger: { redact: ["req.headers.authorization"] } });
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
await app.register(multipart, { limits: { fileSize: config.maxApkBytes, files: 1 } });
if (process.env.CORS_ORIGIN) await app.register(cors, { origin: process.env.CORS_ORIGIN });
await app.register(fstatic, { root: resolve(process.env.FRONTEND_DIR ?? "../frontend") });
app.get("/health", async () => ({ ok: true }));
await app.register(projectRoutes);

await migrate();
await app.listen({ port: config.port, host: "0.0.0.0" });
