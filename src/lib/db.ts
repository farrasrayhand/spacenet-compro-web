import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * SQLite memakai modul bawaan Node (node:sqlite), jadi tidak ada dependency
 * native yang harus dikompilasi. Satu file DB di ./data/spacenet.db.
 *
 * Catatan deploy: filesystem serverless (Vercel) tidak persisten. Untuk
 * produksi pilih VPS dengan volume, atau ganti ke Turso/libSQL.
 */
const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "data", "spacenet.db");

type DbGlobal = typeof globalThis & { __spacenetDb?: DatabaseSync };

function createDb(): DatabaseSync {
  const dir = path.dirname(DB_PATH);
  mkdirSync(dir, { recursive: true });

  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      alamat TEXT NOT NULL,
      paket_id TEXT NOT NULL,
      tanggal_pasang TEXT,
      catatan TEXT,
      consent_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'baru',
      source TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_registrations_created
      ON registrations (created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_registrations_status
      ON registrations (status);
  `);

  // Migrasi ringan untuk kolom yang ditambahkan setelah rilis pertama.
  const columns = db.prepare("PRAGMA table_info(registrations)").all() as { name: string }[];
  const existing = new Set(columns.map((column) => column.name));

  if (!existing.has("notified_at")) {
    db.exec("ALTER TABLE registrations ADD COLUMN notified_at TEXT");
  }
  if (!existing.has("notified_channel")) {
    db.exec("ALTER TABLE registrations ADD COLUMN notified_channel TEXT");
  }

  return db;
}

/** Singleton supaya hot reload dev tidak membuka koneksi baru terus-menerus. */
export function getDb(): DatabaseSync {
  const g = globalThis as DbGlobal;
  if (!g.__spacenetDb) {
    g.__spacenetDb = createDb();
  }
  return g.__spacenetDb;
}
