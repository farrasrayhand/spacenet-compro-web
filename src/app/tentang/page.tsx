import type { Metadata } from "next";
import { Building2, Clock, MapPin, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { Gallery } from "@/components/sections/Gallery";
import { WhyUs } from "@/components/sections/WhyUs";
import { getCompany, getGalleryItems, getWhyPoints } from "@/lib/data";
import { galleryTodoNote } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Profil PT. Space Networx Mediatama (SpaceNet), penyedia jaringan internet fiber dan wireless di Samarinda, Kalimantan Timur.",
  alternates: { canonical: "/tentang" },
};

export default async function TentangPage() {
  const [company, why, gallery] = await Promise.all([
    getCompany(),
    getWhyPoints(),
    getGalleryItems(),
  ]);

  const facts = [
    { label: "Nama perusahaan", value: company.legalName },
    { label: "Merek layanan", value: `${company.brand} WiFi` },
    { label: "Bidang usaha", value: "Penyedia jasa akses internet (ISP) lokal" },
    { label: "Jaringan", value: "Fiber dan wireless" },
    { label: "Kantor pusat", value: company.address },
    { label: "Jam operasional", value: company.hours },
    { label: "WhatsApp", value: company.phoneDisplay },
  ];

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm font-semibold text-bluetext">Tentang kami</p>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">
            Perusahaan jaringan lokal yang melayani Samarinda
          </h1>
          <p className="measure mt-5 text-base leading-relaxed text-muted">
            {company.legalName} atau {company.brand} adalah penyedia jaringan internet yang melayani
            rumah dan bisnis di Samarinda, Kalimantan Timur. Kami mengoperasikan jaringan fiber dan
            wireless, dengan dukungan teknisi dan layanan pelanggan setiap hari.
          </p>
        </div>
      </section>

      <section aria-labelledby="fakta" className="border-b border-line bg-mist">
        <div className="wrap py-12 sm:py-16">
          <h2 id="fakta" className="text-2xl">
            Data perusahaan
          </h2>

          <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Data singkat perusahaan</caption>
              <tbody className="divide-y divide-line">
                {facts.map((fact) => (
                  <tr key={fact.label}>
                    <th scope="row" className="w-48 px-4 py-3 text-left align-top font-medium text-muted">
                      {fact.label}
                    </th>
                    <td className="px-4 py-3 text-ink">{fact.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted">
                Kantor dan gudang perangkat berada di Samarinda Ilir, melayani pemasangan di area
                Kota Samarinda.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted">
                Kantor buka Senin sampai Minggu pukul 08.00-17.00. Support darurat tetap berjalan 24
                jam melalui WhatsApp.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted">
                Terdaftar sebagai anggota APJII Pengurus Wilayah Kalimantan Timur.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted">
                Melayani pelanggan rumahan, usaha kecil, dan kebutuhan konektivitas perangkat
                (Internet of Things).
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="visi-misi" className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <h2 id="visi-misi" className="text-2xl">
            Visi dan misi
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface p-6">
              <h3 className="text-lg font-semibold not-italic text-ink">Visi</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                TODO: konfirmasi dari klien. Teks visi resmi belum diberikan, jadi bagian ini belum
                diisi.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-6">
              <h3 className="text-lg font-semibold not-italic text-ink">Misi</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
                <li>TODO: konfirmasi dari klien.</li>
                <li>TODO: konfirmasi dari klien.</li>
                <li>TODO: konfirmasi dari klien.</li>
              </ol>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-line p-5">
            <h3 className="text-base font-semibold not-italic text-ink">Sejarah singkat</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              TODO: konfirmasi dari klien. Tahun berdiri dan riwayat perusahaan belum tersedia di
              sumber resmi mana pun.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="dokumentasi" className="border-b border-line bg-mist">
        <div className="wrap py-12 sm:py-16">
          <h2 id="dokumentasi" className="text-2xl">
            Dokumentasi
          </h2>
          <p className="measure mt-3 text-sm leading-relaxed text-muted">
            Foto kegiatan operasional dan tim SpaceNet akan ditampilkan di sini setelah dokumentasi
            resmi diterima.
          </p>
          <div className="mt-6">
            <Gallery items={gallery} emptyNote={galleryTodoNote} />
          </div>
        </div>
      </section>

      <WhyUs points={why} />
      <CtaBand phoneDisplay={company.phoneDisplay} />
    </>
  );
}
