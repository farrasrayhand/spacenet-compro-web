import type { Company, TrustPoint, ValuePoint } from "@/types";

/**
 * Sumber: situs lama https://www.spacenetworkmediatama.com/ dan brief bagian 6.
 * Email sengaja null sampai pemilik mengonfirmasi (brief bagian 10 poin 7).
 * Catatan: alamat email pernah tampil publik di situs lama, tetapi belum
 * dikonfirmasi masih aktif -> jangan ditampilkan dulu.
 */
export const company: Company = {
  brand: "SpaceNet",
  legalName: "PT. Space Network Mediatama",
  whatsapp: "62811585255",
  phoneDisplay: "0811-585-255",
  address:
    "Jl. Jelawat gg 9 no 11, Kel. Sidomulyo, Kec. Samarinda Ilir, Kota Samarinda 75114, Kalimantan Timur",
  addressLines: [
    "Jl. Jelawat gg 9 no 11",
    "Kel. Sidomulyo, Kec. Samarinda Ilir",
    "Kota Samarinda 75114",
    "Kalimantan Timur",
  ],
  hours: "Senin sampai Minggu, 08.00-17.00 (tutup pada hari nasional)",
  emergencySupport: "Support darurat 24 jam setiap hari via WhatsApp",
  email: null,
};

/** Sosial media belum ada yang dikonfirmasi (brief bagian 10 poin 7). */
export const socialLinks: { label: string; href: string }[] = [];

/** Strip 4 nilai jual di bawah hero. */
export const valuePoints: ValuePoint[] = [
  {
    id: "instalasi",
    title: "Gratis pemasangan",
    description: "Biaya pemasangan digratiskan selama periode promo akhir tahun.",
  },
  {
    id: "fup",
    title: "Tanpa batas FUP",
    description: "Tidak ada pemotongan kecepatan karena kuota pemakaian.",
  },
  {
    id: "harga",
    title: "Harga terjangkau",
    description: "Empat pilihan paket mulai Rp170.000 per bulan.",
  },
  {
    id: "support",
    title: "Support setiap hari",
    description: "Kantor buka Senin sampai Minggu, support darurat 24 jam via WhatsApp.",
  },
];

export type WhyPoint = {
  id: string;
  title: string;
  description: string;
};

/**
 * Semua klaim di bawah dikutip dari situs lama (brief bagian 6).
 * Jangan menambah angka atau klaim baru di sini.
 */
export const whyPoints: WhyPoint[] = [
  {
    id: "dedicated",
    title: "Bandwidth dedicated",
    description: "Bandwidth tidak dibagi dengan pelanggan lain, sesuai keterangan di situs lama kami.",
  },
  {
    id: "uptime",
    title: "Uptime 99,9% dengan link cadangan",
    description: "Infrastruktur redundan dan link cadangan untuk menjaga koneksi tetap aktif.",
  },
  {
    id: "jaringan",
    title: "Jaringan fiber dan wireless",
    description: "Dua jenis jaringan yang dipakai menyesuaikan kondisi area pemasangan.",
  },
  {
    id: "notifikasi",
    title: "Notifikasi lewat WhatsApp",
    description: "Info tagihan, konfirmasi pembayaran, dan pemberitahuan gangguan dikirim ke WhatsApp Anda.",
  },
  {
    id: "monitoring",
    title: "Pemantauan status koneksi",
    description: "Status koneksi dan riwayat pembayaran dapat dipantau dari dashboard pelanggan.",
  },
  {
    id: "respons",
    title: "Respons teknisi kurang dari 2 jam",
    description: "Untuk laporan gangguan di area jangkauan, teknisi menindaklanjuti kurang dari 2 jam.",
  },
];

export const trustPoints: TrustPoint[] = [
  {
    id: "apjii",
    title: "Anggota APJII Wilayah Kalimantan Timur",
    description:
      "Terdaftar sebagai anggota Asosiasi Penyelenggara Jasa Internet Indonesia (APJII) Pengurus Wilayah Kalimantan Timur.",
    needsAsset: true,
  },
  {
    id: "iot",
    title: "Layanan Internet of Things",
    description:
      "SpaceNet juga menyediakan layanan Internet of Things untuk kebutuhan konektivitas perangkat.",
  },
];
