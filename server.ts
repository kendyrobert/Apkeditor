import Fastify from "fastify";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import fstatic from "@fastify/static";
import { resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { access, mkdir, constants } from "node:fs/promises";
import { config } from "./config.js";
import { migrate, pool } from "./db/pool.js";
import { projectRoutes } from "./routes/projects.js";

const app = Fastify({ logger: { redact: ["req.headers.authorization"] } });
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
await app.register(multipart, { limits: { fileSize: config.maxApkBytes, files: 1 } });
// CORS solo si el frontend se aloja en otro dominio (CORS_ORIGIN=https://tu-front.com)
if (process.env.CORS_ORIGIN) await app.register(cors, { origin: process.env.CORS_ORIGIN });
// Sirve frontend/index.html desde el mismo servidor
await app.register(fstatic, { root: resolve(process.env.FRONTEND_DIR ?? "../frontend") });
const run = promisify(execFile);
let migrated = false;
app.get("/health", async () => {
  const r: Record<string, unknown> = { ok: true, maxMb: config.maxApkBytes / 1024 / 1024 };
  try {
    await pool.query("select 1");
    if (!migrated) { await migrate(); migrated = true; }
    r.db = true;
  } catch (e: any) { r.db = false; r.dbError = e?.code ?? "error"; r.ok = false; }
  try { const { stdout } = await run(config.aaptBin, ["v"], { timeout: 5000 }); r.aapt = true; r.aaptVersion = stdout.trim().slice(0, 60); }
  catch { r.aapt = false; r.ok = false; }
  try { await mkdir(config.storageDir, { recursive: true }); await access(config.storageDir, constants.W_OK); r.storage = true; }
  catch { r.storage = false; r.ok = false; }
  return r;
});
await app.register(projectRoutes);

try { await migrate(); migrated = true; } catch (e) { app.log.error("Migración fallida: la base de datos no responde"); }
await app.listen({ port: config.port, host: "0.0.0.0" });
