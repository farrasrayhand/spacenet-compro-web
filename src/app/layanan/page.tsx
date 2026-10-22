import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Cpu, Home } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCompany, getPackages } from "@/lib/data";
import { formatRupiah } from "@/lib/format";

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Layanan internet SpaceNet untuk rumah, bisnis dengan bandwidth dedicated, dan konektivitas Internet of Things di Samarinda.",
  alternates: { canonical: "/layanan" },
};

export default async function LayananPage() {
  const [company, packages] = await Promise.all([getCompany(), getPackages()]);
  const cheapest = packages.reduce((min, pkg) => (pkg.pricePerMonth < min.pricePerMonth ? pkg : min));

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm font-semibold text-bluetext">Layanan</p>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">
            Koneksi internet untuk rumah, bisnis, dan perangkat
          </h1>
          <p className="measure mt-5 text-base leading-relaxed text-muted">
            SpaceNet melayani pemasangan jaringan fiber dan wireless di Samarinda. Berikut ringkasan
            layanan yang tersedia. Detail teknis yang belum dikonfirmasi ditandai sebagai TODO.
          </p>
        </div>
      </section>

      <section aria-labelledby="rumahan" className="border-b border-line">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-[3rem_1fr_1fr] lg:gap-10">
          <Home className="h-7 w-7 text-blue" aria-hidden="true" />
          <div>
            <h2 id="rumahan" className="text-2xl">
              Internet rumahan
            </h2>
            <p className="measure mt-4 text-base leading-relaxed text-muted">
              Untuk kebutuhan sehari-hari: belajar, bekerja dari rumah, streaming, dan bermain game.
              Tersedia empat paket mulai {formatRupiah(cheapest.pricePerMonth)} per bulan, semuanya
              tanpa batas FUP.
            </p>
            <Link
              href="/paket"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bluetext hover:text-ink"
            >
              Lihat paket rumahan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="space-y-2 border-t border-line pt-4 text-sm text-muted lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <li>Kecepatan 30 sampai 100 Mbps</li>
            <li>Tanpa batas FUP</li>
            <li>Gratis pemasangan selama promo</li>
            <li>Notifikasi tagihan dan gangguan lewat WhatsApp</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="bisnis" className="border-b border-line bg-mist">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-[3rem_1fr_1fr] lg:gap-10">
          <Building2 className="h-7 w-7 text-blue" aria-hidden="true" />
          <div>
            <h2 id="bisnis" className="text-2xl">
              Bisnis dan dedicated
            </h2>
            <p className="measure mt-4 text-base leading-relaxed text-muted">
              Untuk kantor, usaha, dan kebutuhan koneksi yang lebih stabil. SpaceNet menyediakan
              bandwidth dedicated dengan infrastruktur redundan dan link cadangan.
            </p>
            <p className="mt-4 rounded border border-dashed border-line bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
              TODO: daftar paket bisnis, SLA, dan harga khusus belum tersedia. Hubungi admin untuk
              penawaran.
            </p>
          </div>
          <ul className="space-y-2 border-t border-line pt-4 text-sm text-muted lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <li>Bandwidth dedicated, tidak dibagi pelanggan lain</li>
            <li>Uptime 99,9% dengan link cadangan</li>
            <li>Respons teknisi kurang dari 2 jam di area jangkauan</li>
            <li>Support darurat 24 jam via WhatsApp</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="iot" className="border-b border-line">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-[3rem_1fr_1fr] lg:gap-10">
          <Cpu className="h-7 w-7 text-blue" aria-hidden="true" />
          <div>
            <h2 id="iot" className="text-2xl">
              Internet of Things
            </h2>
            <p className="measure mt-4 text-base leading-relaxed text-muted">
              SpaceNet juga menyebut layanan Internet of Things sebagai bagian dari penawarannya.
              Ringkasan ini diambil dari brosur resmi perusahaan.
            </p>
            <p className="mt-4 rounded border border-dashed border-line px-4 py-3 text-xs leading-relaxed text-muted">
              TODO: cakupan layanan IoT (perangkat yang didukung, skema konektivitas, harga) belum
              dijelaskan di sumber resmi mana pun.
            </p>
          </div>
          <ul className="space-y-2 border-t border-line pt-4 text-sm text-muted lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <li>Konektivitas untuk perangkat</li>
            <li>Memanfaatkan jaringan fiber dan wireless SpaceNet</li>
            <li>Detail teknis menunggu konfirmasi perusahaan</li>
          </ul>
        </div>
      </section>

      <CtaBand phoneDisplay={company.phoneDisplay} />
    </>
  );
}
