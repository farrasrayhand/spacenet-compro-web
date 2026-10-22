import { company, socialLinks, trustPoints, valuePoints, whyPoints } from "@/data/company";
import { areaCoordinates, coverageAreas, kecamatanCoordinates } from "@/data/coverage";
import { galleryItems, type GalleryItem } from "@/data/gallery";
import { faqItems } from "@/data/faq";
import { packagesData, promoFeature } from "@/data/packages";
import { promo } from "@/data/promo";
import { buildRegistrationMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  Company,
  CoverageArea,
  CoverageResult,
  FaqItem,
  Package,
  PackageId,
  Promo,
  Registration,
  TrustPoint,
  ValuePoint,
} from "@/types";
import type { WhyPoint } from "@/data/company";

/**
 * Satu-satunya pintu data untuk komponen.
 * Semua fungsi async supaya nanti cukup diganti isi fungsinya menjadi
 * fetch()/query SQLite tanpa mengubah komponen pemanggil.
 */

function withPromoFeature(list: Package[]): Package[] {
  return list.map((pkg) => ({
    ...pkg,
    features: promo.active ? [...pkg.features, promoFeature] : pkg.features,
  }));
}

export async function getPackages(): Promise<Package[]> {
  return withPromoFeature(packagesData);
}

export async function getPackageById(id: PackageId): Promise<Package | null> {
  const found = packagesData.find((pkg) => pkg.id === id);
  if (!found) return null;
  return withPromoFeature([found])[0];
}

export async function getPopularPackage(): Promise<Package | null> {
  const found = packagesData.find((pkg) => pkg.highlight) ?? null;
  if (!found) return null;
  return withPromoFeature([found])[0];
}

export async function getPromo(): Promise<Promo> {
  return promo;
}

export async function getCompany(): Promise<Company> {
  return company;
}

export async function getSocialLinks(): Promise<{ label: string; href: string }[]> {
  return socialLinks;
}

/** Poin nilai jual; klaim gratis pemasangan diganti bila promo tidak aktif. */
export async function getValuePoints(): Promise<ValuePoint[]> {
  if (promo.active) return valuePoints;
  return valuePoints.map((point) =>
    point.id === "instalasi"
      ? {
          ...point,
          title: "Pemasangan mudah",
          description: "Pemasangan dijadwalkan bersama teknisi kami di area jangkauan.",
        }
      : point,
  );
}

export async function getWhyPoints(): Promise<WhyPoint[]> {
  return whyPoints;
}

export async function getTrustPoints(): Promise<TrustPoint[]> {
  return trustPoints;
}

export async function getCoverageAreas(): Promise<CoverageArea[]> {
  return coverageAreas;
}

export async function getFaqItems(): Promise<FaqItem[]> {
  return faqItems;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return galleryItems;
}

export async function getCoverageCoordinates(): Promise<Record<string, { lat: number; lng: number }>> {
  return kecamatanCoordinates;
}

/** Titik peta per kelurahan; fallback ke pusat kecamatan bila belum ada. */
export async function getCoveragePoints(): Promise<Record<string, { lat: number; lng: number }>> {
  const points: Record<string, { lat: number; lng: number }> = {};

  for (const area of coverageAreas) {
    const key = `${area.kecamatan}|${area.kelurahan}`;
    points[key] = areaCoordinates[key] ?? kecamatanCoordinates[area.kecamatan] ?? { lat: -0.502, lng: 117.14 };
  }

  return points;
}

function normalizeAreaName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b(kel|kelurahan|kec|kecamatan|kota|kabupaten)\.?\b/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const statusCopy: Record<CoverageArea["status"], { title: string; message: string }> = {
  aktif: {
    title: "Area Anda terjangkau",
    message:
      "Jaringan SpaceNet sudah tersedia di area ini. Anda bisa langsung mendaftar dan tim kami akan mengonfirmasi jadwal pemasangan.",
  },
  perluasan: {
    title: "Area Anda dalam perluasan jaringan",
    message:
      "Jaringan sedang diperluas ke area ini. Hubungi kami lewat WhatsApp untuk mengetahui perkiraan waktu ketersediaan.",
  },
  antrian: {
    title: "Area Anda belum tersedia",
    message:
      "Jaringan belum tersedia di area ini. Anda bisa masuk daftar antrean agar dihubungi saat jaringan tersedia.",
  },
};

export async function checkCoverage(kelurahan: string, kecamatan: string): Promise<CoverageResult> {
  const targetKelurahan = normalizeAreaName(kelurahan);
  const targetKecamatan = normalizeAreaName(kecamatan);

  const matched =
    coverageAreas.find(
      (area) =>
        normalizeAreaName(area.kelurahan) === targetKelurahan &&
        normalizeAreaName(area.kecamatan) === targetKecamatan,
    ) ??
    coverageAreas.find((area) => normalizeAreaName(area.kelurahan) === targetKelurahan) ??
    null;

  const status = matched?.status ?? "antrian";
  return { status, matchedArea: matched, ...statusCopy[status] };
}

/**
 * Menyimpan pendaftaran ke backend lalu mengembalikan URL WhatsApp.
 * Kalau API gagal (mis. offline), pendaftaran tetap bisa dikirim lewat
 * WhatsApp dan hasilnya ditandai `saved: false` agar UI bisa memberi tahu.
 */
export async function submitRegistration(
  input: Registration,
  pkg: Package,
  extra: { website?: string } = {},
): Promise<{ whatsappUrl: string; saved: boolean; id?: number }> {
  const message = buildRegistrationMessage({
    nama: input.nama,
    whatsapp: input.whatsapp,
    alamat: input.alamat,
    paketNama: pkg.name,
    paketSpeed: pkg.speedMbps,
    paketHarga: pkg.pricePerMonth,
    tanggalPasang: input.tanggalPasang,
    catatan: input.catatan,
  });
  const fallbackUrl = buildWhatsAppUrl({ text: message });

  try {
    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, ...extra, source: "web" }),
    });

    if (!response.ok) return { whatsappUrl: fallbackUrl, saved: false };

    const data = (await response.json()) as { id?: number; whatsappUrl?: string };
    return { whatsappUrl: data.whatsappUrl ?? fallbackUrl, saved: true, id: data.id };
  } catch {
    return { whatsappUrl: fallbackUrl, saved: false };
  }
}
