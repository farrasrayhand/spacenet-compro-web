import { describe, expect, it } from "vitest";
import { coverageSchema, registrationSchema } from "@/lib/validation";

const valid = {
  nama: "Budi Santoso",
  whatsapp: "0811-585-255",
  alamat: "Jl. Merdeka no 10, Samarinda Ilir",
  paketId: "mantap" as const,
  tanggalPasang: "",
  catatan: "",
  consent: true,
};

describe("registrationSchema", () => {
  it("lolos untuk data wajar", () => {
    expect(registrationSchema.safeParse(valid).success).toBe(true);
  });

  it("menolak nama terlalu pendek", () => {
    const result = registrationSchema.safeParse({ ...valid, nama: "B" });
    expect(result.success).toBe(false);
  });

  it("menolak nomor WhatsApp non-Indonesia", () => {
    const result = registrationSchema.safeParse({ ...valid, whatsapp: "+12025550123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("nomor Indonesia");
  });

  it("menolak alamat terlalu pendek", () => {
    expect(registrationSchema.safeParse({ ...valid, alamat: "pendek" }).success).toBe(false);
  });

  it("menolak paket yang tidak dikenal", () => {
    expect(registrationSchema.safeParse({ ...valid, paketId: "ultra" }).success).toBe(false);
  });

  it("wajib menyetujui pemrosesan data", () => {
    const result = registrationSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("persetujuan");
  });

  it("menolak nama dengan karakter aneh", () => {
    expect(registrationSchema.safeParse({ ...valid, nama: "Budi <script>" }).success).toBe(false);
  });
});

describe("coverageSchema", () => {
  it("mewajibkan kelurahan dan kecamatan", () => {
    expect(coverageSchema.safeParse({ kelurahan: "Sidomulyo", kecamatan: "Samarinda Ilir" }).success).toBe(true);
    expect(coverageSchema.safeParse({ kelurahan: "", kecamatan: "Samarinda Ilir" }).success).toBe(false);
  });
});
