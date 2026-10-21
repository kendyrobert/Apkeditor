export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? "postgres://kendy:kendy@localhost:5432/kendy",
  storageDir: process.env.STORAGE_DIR ?? "./data",
  maxApkBytes: Number(process.env.MAX_APK_MB ?? 200) * 1024 * 1024,
  aaptBin: process.env.AAPT_BIN ?? "aapt",
  maxEntries: 50_000,
  maxUncompressedBytes: 2 * 1024 ** 3,
  maxCompressionRatio: 200,
  toolTimeoutMs: 30_000,
};
