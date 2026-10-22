import type { CoverageArea } from "@/types";

/**
 * PERINGATAN: ini DATA CONTOH, bukan daftar area resmi SpaceNet.
 * Daftar kelurahan/kecamatan asli belum diberikan pemilik (brief bagian 10 poin 6).
 * UI wajib menampilkan penanda bahwa data ini contoh.
 */
export const COVERAGE_IS_SAMPLE = true;

export const coverageSampleNote =
  "Data area di halaman ini masih contoh dan belum diverifikasi. Konfirmasi ketersediaan jaringan lewat WhatsApp sebelum mendaftar.";

/**
 * Titik pusat kecamatan, diambil dari OpenStreetMap Nominatim (boundary relation).
 * Hanya untuk menempatkan penanda peta; batas wilayah resmi tetap milik pemerintah.
 */
export const kecamatanCoordinates: Record<string, { lat: number; lng: number }> = {
  "Samarinda Ilir": { lat: -0.5063749, lng: 117.1615222 },
  "Samarinda Ulu": { lat: -0.456522, lng: 117.1139871 },
  "Samarinda Kota": { lat: -0.499574, lng: 117.1505567 },
  "Sungai Kunjang": { lat: -0.5122225, lng: 117.0882481 },
  Sambutan: { lat: -0.509338, lng: 117.1820748 },
};

/**
 * Titik tiap kelurahan dari OpenStreetMap Nominatim. Beberapa nama kelurahan
 * tidak punya batas administrasi yang jelas di OSM (Sidodadi, Bugis, Karang
 * Anyar, Karang Mumus), jadi memakai pusat kecamatan + geser kecil agar tidak
 * menumpuk. Ini penanda perkiraan, bukan batas wilayah resmi.
 */
export const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  "Samarinda Ilir|Sidomulyo": { lat: -0.4950513, lng: 117.1632031 },
  "Samarinda Ilir|Sidodadi": { lat: -0.4920179, lng: 117.1309702 },
  "Samarinda Ilir|Sungai Dama": { lat: -0.5070743, lng: 117.1607834 },
  "Samarinda Ilir|Karang Mumus": { lat: -0.5083, lng: 117.1652 },
  "Samarinda Ilir|Pelita": { lat: -0.4879306, lng: 117.158945 },
  "Samarinda Ulu|Jawa": { lat: -0.4977006, lng: 117.1370345 },
  "Samarinda Ulu|Bugis": { lat: -0.4591, lng: 117.1187 },
  "Samarinda Ulu|Air Putih": { lat: -0.4837575, lng: 117.1271547 },
  "Samarinda Kota|Karang Anyar": { lat: -0.5016, lng: 117.1458 },
  "Samarinda Kota|Pasar Pagi": { lat: -0.5011398, lng: 117.1476095 },
  "Sungai Kunjang|Karang Asam Ulu": { lat: -0.5189023, lng: 117.1119888 },
  "Sambutan|Sungai Kapih": { lat: -0.5369232, lng: 117.1758679 },
};

export const coverageAreas: CoverageArea[] = [
  { kecamatan: "Samarinda Ilir", kelurahan: "Sidomulyo", status: "aktif" },
  { kecamatan: "Samarinda Ilir", kelurahan: "Sidodadi", status: "aktif" },
  { kecamatan: "Samarinda Ilir", kelurahan: "Sungai Dama", status: "aktif" },
  { kecamatan: "Samarinda Ilir", kelurahan: "Karang Mumus", status: "perluasan" },
  { kecamatan: "Samarinda Ilir", kelurahan: "Pelita", status: "antrian" },
  { kecamatan: "Samarinda Ulu", kelurahan: "Jawa", status: "aktif" },
  { kecamatan: "Samarinda Ulu", kelurahan: "Bugis", status: "aktif" },
  { kecamatan: "Samarinda Ulu", kelurahan: "Air Putih", status: "perluasan" },
  { kecamatan: "Samarinda Kota", kelurahan: "Karang Anyar", status: "aktif" },
  { kecamatan: "Samarinda Kota", kelurahan: "Pasar Pagi", status: "perluasan" },
  { kecamatan: "Sungai Kunjang", kelurahan: "Karang Asam Ulu", status: "antrian" },
  { kecamatan: "Sambutan", kelurahan: "Sungai Kapih", status: "antrian" },
];
