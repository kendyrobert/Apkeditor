import pg from "pg";
import { readFileSync } from "node:fs";
import { config } from "../config.js";

export const pool = new pg.Pool({ connectionString: config.databaseUrl });

export async function migrate() {
  const sql = readFileSync(new URL("./001_init.sql", import.meta.url), "utf8");
  await pool.query(sql);
}
