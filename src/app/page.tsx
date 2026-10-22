import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { ValueStrip } from "@/components/sections/ValueStrip";
import { PackageList } from "@/components/sections/PackageList";
import { CoverageChecker } from "@/components/sections/CoverageChecker";
import { WhyUs } from "@/components/sections/WhyUs";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { CtaBand } from "@/components/sections/CtaBand";
import { coverageSampleNote } from "@/data/coverage";
import {
  getCompany,
  getPackages,
  getPromo,
  getTrustPoints,
  getValuePoints,
  getWhyPoints,
} from "@/lib/data";

export default async function HomePage() {
  const [packages, promoData, companyData, values, why, trust] = await Promise.all([
    getPackages(),
    getPromo(),
    getCompany(),
    getValuePoints(),
    getWhyPoints(),
    getTrustPoints(),
  ]);

  return (
    <>
      <Hero promoActive={promoData.active} promoNote={promoData.note} />

      <ValueStrip points={values} />

      <section aria-labelledby="paket" className="border-b border-line">
        <div className="wrap py-14 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-bluetext">Paket internet</p>
              <h2 id="paket" className="mt-3 text-2xl sm:text-3xl">
                Pilih kecepatan yang sesuai kebutuhan Anda
              </h2>
              <p className="measure mt-4 text-base leading-relaxed text-muted">
                Empat pilihan paket dengan harga bulanan tetap. Semua paket tanpa batas FUP
                {promoData.active ? " dan gratis pemasangan selama periode promo" : ""}.
              </p>
            </div>
            <Link
              href="/paket"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-bluetext hover:text-ink"
            >
              Lihat tabel perbandingan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8">
            <PackageList packages={packages} />
          </div>

          <p className="mt-5 text-xs text-muted">
            Harga sesuai brosur promo terbaru. Ketersediaan paket dan jadwal pemasangan dikonfirmasi
            admin lewat WhatsApp.
          </p>
        </div>
      </section>

      <section aria-labelledby="cek-jangkauan" className="border-b border-line bg-mist">
        <div className="wrap py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-bluetext">Cek jangkauan</p>
            <h2 id="cek-jangkauan" className="mt-3 text-2xl sm:text-3xl">
              Pastikan jaringan SpaceNet tersedia di area Anda
            </h2>
            <p className="measure mt-4 text-base leading-relaxed text-muted">
              Masukkan kelurahan dan kecamatan tempat Anda tinggal. Jika area belum tersedia, kami
              catat sebagai antrean pemasangan.
            </p>
          </div>

          <div className="mt-8">
            <CoverageChecker note={coverageSampleNote} />
          </div>
        </div>
      </section>

      <WhyUs points={why} />
      <TrustBadges points={trust} />
      <CtaBand phoneDisplay={companyData.phoneDisplay} />
    </>
  );
}
