# SpaceNet — Company Profile (Frontend)

Website company profile **SpaceNet / PT. Space Networx Mediatama**, penyedia jaringan internet
fiber dan wireless di Samarinda, Kalimantan Timur.

Tahap ini **frontend saja**. Belum ada backend, API, database, autentikasi, atau panel admin.

## Stack

| Bagian | Pilihan |
| --- | --- |
| Framework | Next.js 16.4.2 (App Router) + React 19 |
| Bahasa | TypeScript 6.0.3 |
| Styling | Tailwind CSS 3.4 + token CSS variable (mode gelap via `prefers-color-scheme`) |
| Font | `next/font` — Exo 2 (heading, italic) + Figtree (isi) |
| Form | React Hook Form + Zod |
| Ikon | lucide-react |
| Data | file statis di `src/data/*.ts`, diakses lewat `src/lib/data.ts` |

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run start    # jalankan hasil build
npm run lint     # ESLint (flat config)
npm run typecheck
```

## Deploy di Easypanel

Pilih **Build Method: Dockerfile** — paling ringan di antara empat opsi Easypanel
(Dockerfile / Buildpacks / Nixpacks / Railpack). Alasannya:

| Opsi | Kenapa |
| --- | --- |
| **Dockerfile** (dipakai) | Multi-stage: stage build dibuang, runtime hanya berisi `server.js` + `node_modules` hasil tracing Next (`output: "standalone"`). Image berbasis `node:22-alpine`. |
| Nixpacks / Railpack | Hasil akhirnya juga container, tapi lapisan Nix + node_modules penuh (tanpa tracing) membuat image lebih besar dan build lebih lama. |
| Buildpacks | Paling berat: banyak layer, cache, dan runtime penuh. |

Setelan di Easypanel:

| Field | Nilai |
| --- | --- |
| Build Method | Dockerfile |
| Dockerfile Path | `Dockerfile` |
| Port | `3000` |
| Health Check Path | `/` |
| Mount / Volume | `/app/data` (wajib, agar SQLite tidak hilang saat redeploy) |
| Env wajib | `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (≥ 16 karakter) |
| Env opsional | `NOTIFY_WEBHOOK_URL`, `SMTP_*`, `NOTIFY_TO`, `DB_PATH` — lihat `.env.example` |

Catatan:

- `next.config.ts` memakai `output: "standalone"` — jangan dihapus, kalau tidak `server.js` tidak
  ikut ter-generate dan container gagal start.
- Stage `runner` sudah menyalin `public/` (logo) dan membuat `/app/data` milik user `node`, lalu
  container jalan sebagai non-root. DB default ada di `/app/data/spacenet.db`.
- SQLite memakai modul bawaan Node (`node:sqlite`), jadi tidak perlu kompilasi native di image.
- Cookie admin memakai `secure: true` di produksi, artinya login hanya bertahan lewat **HTTPS**.
  Domain Easypanel sudah TLS; kalau dites lewat `http://IP:3000` login tidak akan tersimpan.
- `sharp` ikut ter-trace ke bundle, jadi optimasi gambar tetap jalan di container.
- Static export (`output: "export"`) **tidak bisa dipakai**: ada `/daftar` dengan `searchParams`,
  API route, dan panel admin yang butuh server.

Tes lokal tanpa Easypanel:

```bash
docker build -t spacenet-web .
docker run --rm -p 3000:3000 -v "$PWD/data:/app/data" \
  -e ADMIN_PASSWORD=rahasia -e ADMIN_SESSION_SECRET=0123456789abcdef0123456789abcdef \
  spacenet-web
```

## Struktur

```
src/
├─ app/                     # rute App Router + globals.css + sitemap/robots/og-image
│  ├─ page.tsx              # beranda
│  ├─ tentang/ paket/ layanan/ jangkauan/ daftar/ bantuan/ kontak/
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx  not-found.tsx
├─ components/
│  ├─ layout/               # Header, MobileMenu, Footer, PromoBanner
│  ├─ sections/             # Hero, ValueStrip, PackageList, PackageComparison,
│  │                        # CoverageChecker, RegistrationForm, WhyUs, TrustBadges, CtaBand
│  └─ ui/                   # Button, Field, Accordion, Logo
├─ data/                    # company, packages, promo, coverage, faq
├─ lib/                     # data, whatsapp, format, validation, nav
└─ types/index.ts
```

## Aturan penting: semua data lewat `src/lib/data.ts`

Komponen **tidak** mengimpor `src/data/*` secara langsung. Semua akses data memakai fungsi async:

```ts
getPackages()  getPackageById()  getPopularPackage()  getPromo()  getCompany()
getValuePoints()  getWhyPoints()  getTrustPoints()  getSocialLinks()
getCoverageAreas()  getFaqItems()  checkCoverage()  submitRegistration()
```

Untuk menyambung backend nanti, cukup ganti isi fungsi-fungsi itu menjadi `fetch()` atau query
SQLite (Drizzle/Prisma). Komponen dan halaman tidak perlu diubah.

`submitRegistration()` sekarang **tidak menyimpan apa pun** — hanya menyusun pesan dan URL WhatsApp.
Itu titik sambung untuk `POST /api/registrations` di tahap berikutnya.

## Helper wajib

- `formatRupiah(170000)` → `"Rp170.000"` (`src/lib/format.ts`)
- `buildWhatsAppUrl({ text })` → `https://wa.me/62811585255?text=...` ter-encode (`src/lib/whatsapp.ts`)
- `buildSubscribeMessage(pkg)` → `"Halo SpaceNet, saya mau berlangganan paket Paket Mantap 50 Mbps."`

## Mematikan banner promo

Cukup ubah satu nilai di `src/data/promo.ts`:

```ts
export const promo: Promo = { active: false, ... };
```

Efeknya (sudah diuji): banner hilang, kalimat promo di hero hilang, dan poin "Gratis pemasangan"
otomatis tidak lagi muncul di kartu paket maupun tabel perbandingan.

## Panel admin & penyimpanan pendaftaran

Form daftar **menyimpan data ke SQLite** lalu membuka WhatsApp. Kalau API gagal, pendaftaran tetap
bisa dikirim lewat WhatsApp (UI memberi tahu bahwa data belum tersimpan).

- Database: `node:sqlite` bawaan Node (tanpa dependency native), file di `data/spacenet.db`
  (bisa diubah lewat `DB_PATH`).
- Tabel `registrations`: nama, whatsapp, alamat, paket, tanggal pasang, catatan, `consent_at`,
  `status`, `source`, `created_at`.
- Panel: `/admin` (filter status + pencarian + ubah status + export CSV + pagination 20/halaman).
- Notifikasi pendaftaran baru: webhook JSON (`NOTIFY_WEBHOOK_URL`, mendukung Discord) dan/atau email
  SMTP (`SMTP_HOST`, `NOTIFY_TO`, dst). Kegagalan notifikasi tidak membatalkan pendaftaran; status
  pengiriman dicatat di kolom `notified_at` / `notified_channel` dan tampil di tabel admin.
- Login: `/admin/login`, sesi cookie httpOnly HMAC 8 jam.

Aktifkan panel dengan membuat `.env.local` dari `.env.example`:

```bash
cp .env.example .env.local
# isi ADMIN_PASSWORD dan ADMIN_SESSION_SECRET (openssl rand -hex 32)
```

**Deploy**: filesystem serverless (Vercel) tidak persisten untuk SQLite. Untuk produksi pakai VPS
dengan volume untuk `./data`, atau ganti ke Turso/libSQL. Rate limit pendaftaran disimpan di memori
(5 per 10 menit per IP) sehingga reset saat restart dan tidak dibagi antar-instance.

## Privasi & consent

Form punya checkbox persetujuan wajib dan tautan ke `/privasi`. Isi kebijakan privasi masih draf
operasional (bertanda TODO) dan perlu ditinjau penanggung jawab hukum klien.

## Galeri dokumentasi

Komponen galeri + lightbox sudah siap tanpa foto. Cara mengisi: taruh file di `public/gallery/`,
lalu daftarkan `src`, `alt`, `caption`, `width`, `height` di `src/data/gallery.ts`. Selama daftar
kosong, halaman Tentang menampilkan catatan TODO (bukan gambar palsu).

## Peta jangkauan

`/jangkauan` menampilkan peta OpenStreetMap (Leaflet) dengan penanda bersimbol per area. Titik
memakai pusat kecamatan dari Nominatim/OSM; **status area tetap data contoh**.

## Testing

```bash
npm test        # Vitest: unit test format, WhatsApp, validasi, repository SQLite
npm run e2e     # smoke test CDP memakai Brave/Chromium (server harus jalan di :3000)
```

`npm run e2e` memeriksa: semua rute punya title + h1, validasi form memunculkan ringkasan galat dan
memindahkan fokus, cek jangkauan menampilkan hasil, dan tidak ada scroll horizontal di 390px.
CI GitHub Actions menjalankan lint, typecheck, unit test, dan build.

## Yang masih perlu diganti pemilik (jangan dikarang)

| Item | Status sekarang | Lokasi |
| --- | --- | --- |
| Logo resmi | Sudah dipasang: dua varian PNG di `public/` (light & dark), dipilih lewat `prefers-color-scheme` | `src/components/ui/Logo.tsx` |
| Logo vektor (SVG) | Belum ada; PNG 400×96 tajam sampai tinggi ±48px | minta ke klien |
| Logo APJII | Belum ada file; lencana berupa teks + catatan TODO | `src/data/company.ts` (`trustPoints`) |
| Daftar kelurahan/kecamatan asli | **Data contoh**, ditandai jelas di UI | `src/data/coverage.ts` |
| Email resmi | Tidak ditampilkan (`email: null`) | `src/data/company.ts` |
| Visi, misi, sejarah | Placeholder `TODO: konfirmasi dari klien` | `src/app/tentang/page.tsx` |
| Jawaban PPN, kontrak minimum, upload speed | Placeholder TODO | `src/data/faq.ts` |
| Daftar klien/mitra | Tidak ditampilkan | `src/data/company.ts` |
| Sosial media | Kosong, tidak dirender | `src/data/company.ts` |

## Data paket (brosur "Spesial Promo Akhir Tahun")

| id | Nama | Kecepatan | Harga/bulan |
| --- | --- | --- | --- |
| `hemat` | Paket Hemat | 30 Mbps | Rp170.000 |
| `mantap` | Paket Mantap (**Paling Populer**) | 50 Mbps | Rp220.000 |
| `ideal` | Paket Ideal | 75 Mbps | Rp270.000 |
| `gamers` | Spesial Gamers | 100 Mbps | Rp340.000 |

Paket lama (10/15/20 Mbps) tidak ditampilkan. PPN, kontrak minimum, dan upload speed tidak
ditambahkan karena tidak ada di brosur.

## Catatan teknis / keputusan

- **TypeScript 6, bukan 7**: `typescript-eslint` (dipakai `eslint-config-next` 16) belum mendukung
  TS 7.0. Menaikkan ke TS 7 membuat `npm run lint` gagal.
- **Tanpa `@hookform/resolvers`**: versi 6 memaksa peer `effect@^4` yang bentrok. Validasi Zod
  dipanggil langsung di `onSubmit` React Hook Form, dengan `setError` per field.
- **Tailwind 3 (bukan 4)**: brief meminta `tailwind.config.ts`, yang merupakan pola Tailwind 3.
- **Token warna** ada di `src/app/globals.css`. Mode gelap hanya mengganti nilai CSS variable.
  `--sky` hanya untuk elemen dekoratif: kontrasnya di mode terang 2,5:1 (di bawah AA untuk teks).
- **Animasi**: motif orbit + roket kecil yang mengelilingi kartu "Tanpa batas FUP" (29 detik/putaran,
  api berkedip 320ms). Semua animasi mati saat `prefers-reduced-motion: reduce`.
- **Logo**: aset klien berformat PNG berlatar putih, diproses jadi transparan. Karena wordmark aslinya
  hitam, dibuat varian dark (wordmark putih, biru brand tetap) — bukan `filter: invert` supaya warna
  biru tidak bergeser ke oranye.
- **Ejaan legal**: `PT. Space Network Mediatama` mengikuti logo resmi klien (brief semula menulis
  "Networx"). Konfirmasi ke klien bila ingin "Networx".
- **Aksesibilitas**: skip link, fokus terlihat, label pada semua field, akordeon dengan
  `aria-expanded`/`aria-controls`, menu seluler `role="dialog"` + tutup dengan Escape, tabel dengan
  `<caption>`/`scope`, iframe peta dengan `title`.
- **SEO**: metadata per halaman, canonical, Open Graph, JSON-LD `LocalBusiness`, `sitemap.xml`,
  `robots.txt`, dan OG image 1200×630 yang digenerate Next.

## Status kriteria selesai (tahap frontend)

- [x] Semua rute (8 halaman) terbuka dan tampil di mobile & desktop
- [x] Empat paket dari brosur; tombol berlangganan membuka WhatsApp dengan pesan benar
- [x] Form daftar memvalidasi input (Zod, pesan Indonesia) dan membuka WhatsApp dengan data terisi
- [x] Banner promo mati hanya dengan `promo.active = false` (diuji)
- [x] Mode gelap berfungsi (token kontras AA: ink 16,7:1; muted 8,0:1; blue 7,5:1)
- [x] `npm run build` dan `npm run lint` lulus tanpa galat
- [x] Tidak ada data/angka klaim di luar brief bagian 5 dan 6
- [x] Pendaftaran tersimpan ke SQLite + panel admin + export CSV + consent privasi
- [x] Peta jangkauan bersimbol (status tidak hanya warna)
- [x] Galeri siap-tempel (menunggu foto klien)
- [x] 27 unit test + smoke test E2E + CI

## Pertanyaan terbuka untuk klien

1. Harga sudah termasuk PPN?
2. Ada kontrak minimum?
3. Upload speed tiap paket, dedicated atau shared?
4. Tanggal berakhir promo akhir tahun?
5. Paket mana yang "Paling Populer"? (sementara `mantap`)
6. Daftar kelurahan/kecamatan terjangkau (asli)
7. Email resmi dan akun media sosial
8. Daftar klien/mitra yang boleh ditampilkan
9. Teks visi, misi, sejarah
10. File logo resmi dan logo APJII
11. Ejaan legal: "Networx" (logo) atau "Network" (domain)?
