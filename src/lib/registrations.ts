import { getDb } from "@/lib/db";
import type { Registration } from "@/types";

export const REGISTRATION_STATUSES = ["baru", "dihubungi", "terpasang", "batal"] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export type StoredRegistration = {
  id: number;
  nama: string;
  whatsapp: string;
  alamat: string;
  paketId: string;
  tanggalPasang: string | null;
  catatan: string | null;
  consentAt: string;
  status: RegistrationStatus;
  source: string | null;
  notifiedAt: string | null;
  notifiedChannel: string | null;
  createdAt: string;
};

type Row = {
  id: number;
  nama: string;
  whatsapp: string;
  alamat: string;
  paket_id: string;
  tanggal_pasang: string | null;
  catatan: string | null;
  consent_at: string;
  status: string;
  source: string | null;
  notified_at: string | null;
  notified_channel: string | null;
  created_at: string;
};

function mapRow(row: Row): StoredRegistration {
  return {
    id: row.id,
    nama: row.nama,
    whatsapp: row.whatsapp,
    alamat: row.alamat,
    paketId: row.paket_id,
    tanggalPasang: row.tanggal_pasang,
    catatan: row.catatan,
    consentAt: row.consent_at,
    status: row.status as RegistrationStatus,
    source: row.source,
    notifiedAt: row.notified_at,
    notifiedChannel: row.notified_channel,
    createdAt: row.created_at,
  };
}

export function createRegistration(
  input: Registration,
  meta: { source?: string; consentAt?: string } = {},
): StoredRegistration {
  const db = getDb();
  const createdAt = new Date().toISOString();
  const consentAt = meta.consentAt ?? createdAt;

  const result = db
    .prepare(
      `INSERT INTO registrations
        (nama, whatsapp, alamat, paket_id, tanggal_pasang, catatan, consent_at, status, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'baru', ?, ?)`,
    )
    .run(
      input.nama,
      input.whatsapp,
      input.alamat,
      input.paketId,
      input.tanggalPasang || null,
      input.catatan || null,
      consentAt,
      meta.source ?? "web",
      createdAt,
    );

  const row = db
    .prepare("SELECT * FROM registrations WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as Row;

  return mapRow(row);
}

type ListOptions = {
  status?: RegistrationStatus | "semua";
  q?: string;
  limit?: number;
  offset?: number;
};

function buildFilter(status: RegistrationStatus | "semua", q: string) {
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (status !== "semua") {
    clauses.push("status = ?");
    params.push(status);
  }

  const query = q.trim();
  if (query) {
    clauses.push("(nama LIKE ? OR whatsapp LIKE ? OR alamat LIKE ?)");
    const like = `%${query}%`;
    params.push(like, like, like);
  }

  return { where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

export function listRegistrations({
  status = "semua",
  q = "",
  limit = 25,
  offset = 0,
}: ListOptions = {}) {
  const db = getDb();
  const { where, params } = buildFilter(status, q);

  const rows = db
    .prepare(
      `SELECT * FROM registrations ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, Math.min(Math.max(limit, 1), 200), Math.max(offset, 0)) as Row[];

  return rows.map(mapRow);
}

export function countRegistrations({
  status = "semua",
  q = "",
}: { status?: RegistrationStatus | "semua"; q?: string } = {}): number {
  const db = getDb();
  const { where, params } = buildFilter(status, q);
  const row = db
    .prepare(`SELECT COUNT(*) as c FROM registrations ${where}`)
    .get(...params) as { c: number };
  return row.c;
}

export function markNotified(id: number, channel: string): void {
  getDb()
    .prepare("UPDATE registrations SET notified_at = ?, notified_channel = ? WHERE id = ?")
    .run(new Date().toISOString(), channel, id);
}

export function updateRegistrationStatus(id: number, status: RegistrationStatus): StoredRegistration | null {
  const db = getDb();
  db.prepare("UPDATE registrations SET status = ? WHERE id = ?").run(status, id);
  const row = db.prepare("SELECT * FROM registrations WHERE id = ?").get(id) as Row | undefined;
  return row ? mapRow(row) : null;
}

export function countByStatus(): Record<RegistrationStatus | "total", number> {
  const db = getDb();
  const rows = db.prepare("SELECT status, COUNT(*) as c FROM registrations GROUP BY status").all() as {
    status: string;
    c: number;
  }[];

  const counts: Record<RegistrationStatus | "total", number> = {
    baru: 0,
    dihubungi: 0,
    terpasang: 0,
    batal: 0,
    total: 0,
  };

  for (const row of rows) {
    if (row.status in counts) counts[row.status as RegistrationStatus] = row.c;
    counts.total += row.c;
  }
  return counts;
}

function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

/** CSV dengan BOM + pemisah ";" supaya rapi dibuka di Excel locale Indonesia. */
export function registrationsToCsv(rows: StoredRegistration[]): string {
  const header = [
    "id",
    "tanggal_daftar",
    "nama",
    "whatsapp",
    "alamat",
    "paket",
    "rencana_pasang",
    "catatan",
    "status",
    "persetujuan_privasi",
    "sumber",
    "notifikasi_terkirim",
    "kanal_notifikasi",
  ];

  const lines = [header.map(csvCell).join(";")];
  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.createdAt,
        row.nama,
        row.whatsapp,
        row.alamat,
        row.paketId,
        row.tanggalPasang,
        row.catatan,
        row.status,
        row.consentAt,
        row.source,
        row.notifiedAt,
        row.notifiedChannel,
      ]
        .map(csvCell)
        .join(";"),
    );
  }

  return `\uFEFF${lines.join("\r\n")}`;
}
