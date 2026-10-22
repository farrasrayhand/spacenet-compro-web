import { describe, expect, it } from "vitest";
import {
  buildRegistrationMessage,
  buildSubscribeMessage,
  buildSubscribeUrl,
  buildWhatsAppUrl,
  sanitizeForMessage,
} from "@/lib/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("memakai nomor perusahaan dan meng-encode teks", () => {
    const url = buildWhatsAppUrl({ text: "Halo & tes = ok?" });
    expect(url).toBe("https://wa.me/62811585255?text=Halo%20%26%20tes%20%3D%20ok%3F");
  });

  it("menerima nomor lain dan membuang karakter non-digit", () => {
    const url = buildWhatsAppUrl({ text: "hai", phone: "+62 811-585-255" });
    expect(url.startsWith("https://wa.me/62811585255?text=hai")).toBe(true);
  });
});

describe("buildSubscribeMessage", () => {
  it("sesuai template brief", () => {
    expect(buildSubscribeMessage({ name: "Paket Mantap", speedMbps: 50 })).toBe(
      "Halo SpaceNet, saya mau berlangganan paket Paket Mantap 50 Mbps.",
    );
  });

  it("URL berlangganan memakai pesan yang sama", () => {
    const url = buildSubscribeUrl({ name: "Paket Hemat", speedMbps: 30 });
    expect(decodeURIComponent(url)).toContain("paket Paket Hemat 30 Mbps");
  });
});

describe("sanitizeForMessage", () => {
  it("membuang karakter kontrol dan meratakan baris baru", () => {
    expect(sanitizeForMessage("  nama\u0000 dengan\nbaris baru  ")).toBe("nama dengan baris baru");
  });

  it("membatasi panjang teks", () => {
    expect(sanitizeForMessage("x".repeat(500), 20)).toHaveLength(20);
  });
});

describe("buildRegistrationMessage", () => {
  it("memuat semua data yang diisi", () => {
    const message = buildRegistrationMessage({
      nama: "Budi",
      whatsapp: "0811-585-255",
      alamat: "Jl. Merdeka 10",
      paketNama: "Paket Mantap",
      paketSpeed: 50,
      paketHarga: 220000,
      tanggalPasang: "2026-11-01",
      catatan: "pagar hijau",
    });

    expect(message).toContain("Nama: Budi");
    expect(message).toContain("Paket: Paket Mantap 50 Mbps (Rp220.000/bulan)");
    expect(message).toContain("Rencana tanggal pasang: 2026-11-01");
    expect(message).toContain("Catatan: pagar hijau");
  });

  it("melewati baris opsional yang kosong", () => {
    const message = buildRegistrationMessage({
      nama: "Budi",
      whatsapp: "0811",
      alamat: "Jl. Merdeka",
      paketNama: "Paket Hemat",
      paketSpeed: 30,
      paketHarga: 170000,
    });
    expect(message).not.toContain("Catatan:");
    expect(message).not.toContain("Rencana tanggal");
  });
});
