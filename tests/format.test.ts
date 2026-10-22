import { describe, expect, it } from "vitest";
import { formatRupiah, formatSpeed, formatTanggalIndonesia } from "@/lib/format";

describe("formatRupiah", () => {
  it("memformat tanpa spasi dan dengan pemisah ribuan", () => {
    expect(formatRupiah(170000)).toBe("Rp170.000");
    expect(formatRupiah(1250000)).toBe("Rp1.250.000");
    expect(formatRupiah(0)).toBe("Rp0");
  });

  it("membulatkan nilai pecahan", () => {
    expect(formatRupiah(220000.6)).toBe("Rp220.001");
  });

  it("tidak menghasilkan NaN untuk nilai tidak wajar", () => {
    expect(formatRupiah(Number.NaN)).toBe("Rp0");
  });
});

describe("formatSpeed", () => {
  it("menambahkan satuan Mbps", () => {
    expect(formatSpeed(50)).toBe("50 Mbps");
  });
});

describe("formatTanggalIndonesia", () => {
  it("mengubah ISO date ke format Indonesia", () => {
    expect(formatTanggalIndonesia("2026-10-21")).toBe("21 Oktober 2026");
  });

  it("mengembalikan string kosong untuk input kosong", () => {
    expect(formatTanggalIndonesia("")).toBe("");
  });
});
