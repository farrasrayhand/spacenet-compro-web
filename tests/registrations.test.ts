import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// DB terpisah untuk test, dibuat sebelum modul db dimuat.
const dir = mkdtempSync(path.join(tmpdir(), "spacenet-test-"));
process.env.DB_PATH = path.join(dir, "test.db");
process.env.ADMIN_SESSION_SECRET = "test-secret-yang-cukup-panjang-123456";

const {
  createRegistration,
  countByStatus,
  countRegistrations,
  listRegistrations,
  markNotified,
  registrationsToCsv,
  updateRegistrationStatus,
} = await import("@/lib/registrations");
const { getDb } = await import("@/lib/db");

const base = {
  nama: "Budi Santoso",
  whatsapp: "0811585255",
  alamat: "Jl. Merdeka no 10, Samarinda Ilir",
  paketId: "mantap" as const,
  tanggalPasang: "2026-11-01",
  catatan: "pagar hijau",
  consent: true,
};

beforeEach(() => {
  getDb().exec("DELETE FROM registrations");
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("registrations", () => {
  it("menyimpan pendaftaran baru dengan status baru", () => {
    const saved = createRegistration(base);
    expect(saved.id).toBeGreaterThan(0);
    expect(saved.status).toBe("baru");
    expect(saved.paketId).toBe("mantap");
    expect(saved.consentAt).toBeTruthy();
  });

  it("menghitung per status", () => {
    const first = createRegistration(base);
    createRegistration({ ...base, nama: "Siti" });
    updateRegistrationStatus(first.id, "dihubungi");

    const counts = countByStatus();
    expect(counts.total).toBe(2);
    expect(counts.baru).toBe(1);
    expect(counts.dihubungi).toBe(1);
  });

  it("memfilter daftar berdasarkan status dan pencarian", () => {
    createRegistration(base);
    createRegistration({ ...base, nama: "Siti Aminah", alamat: "Jl. Jelawat 9" });

    expect(listRegistrations({ status: "semua" })).toHaveLength(2);
    expect(listRegistrations({ q: "Siti" })).toHaveLength(1);
    expect(listRegistrations({ status: "terpasang" })).toHaveLength(0);
  });

  it("membagi daftar per halaman dan menghitung total", () => {
    for (let i = 0; i < 25; i++) {
      createRegistration({ ...base, nama: `Pelanggan ${String.fromCharCode(97 + (i % 26))}` });
    }

    const firstPage = listRegistrations({ limit: 20, offset: 0 });
    const secondPage = listRegistrations({ limit: 20, offset: 20 });

    expect(firstPage).toHaveLength(20);
    expect(secondPage).toHaveLength(5);
    expect(countRegistrations()).toBe(25);
  });

  it("mencatat kanal notifikasi", () => {
    const saved = createRegistration(base);
    markNotified(saved.id, "webhook,email");

    const row = listRegistrations().find((item) => item.id === saved.id);
    expect(row?.notifiedAt).toBeTruthy();
    expect(row?.notifiedChannel).toBe("webhook,email");
  });

  it("mengekspor CSV dengan header dan BOM", () => {
    createRegistration(base);
    const csv = registrationsToCsv(listRegistrations());
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"nama"');
    expect(csv).toContain("Budi Santoso");
  });

  it("mengembalikan null saat status id tidak ada", () => {
    expect(updateRegistrationStatus(99999, "batal")).toBeNull();
  });
});
