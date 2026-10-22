import type { Metadata } from "next";
import { CoverageChecker } from "@/components/sections/CoverageChecker";
import { CoverageMap } from "@/components/sections/CoverageMap";
import { CtaBand } from "@/components/sections/CtaBand";
import { COVERAGE_IS_SAMPLE, coverageSampleNote } from "@/data/coverage";
import { getCompany, getCoverageAreas, getCoveragePoints } from "@/lib/data";
import type { CoverageStatus } from "@/types";

export const metadata: Metadata = {
  title: "Cek Jangkauan",
  description:
    "Periksa apakah jaringan SpaceNet sudah tersedia di kelurahan dan kecamatan Anda di Samarinda.",
  alternates: { canonical: "/jangkauan" },
};

const statusLabel: Record<CoverageStatus, string> = {
  aktif: "Terjangkau",
  perluasan: "Dalam perluasan",
  antrian: "Belum tersedia",
};

const statusClass: Record<CoverageStatus, string> = {
  aktif: "border-blue text-blue",
  perluasan: "border-line text-ink",
  antrian: "border-line text-muted",
};

export default async function JangkauanPage() {
  const [areas, company, points] = await Promise.all([
    getCoverageAreas(),
    getCompany(),
    getCoveragePoints(),
  ]);

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm font-semibold text-bluetext">Cek jangkauan</p>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">
            Apakah jaringan SpaceNet sudah sampai ke lokasi Anda?
          </h1>
          <p className="measure mt-5 text-base leading-relaxed text-muted">
            Masukkan kelurahan dan kecamatan. Hasil pemeriksaan menunjukkan salah satu dari tiga
            status: terjangkau, dalam perluasan, atau belum tersedia dan masuk antrean.
          </p>
        </div>
      </section>

      <section aria-labelledby="form-jangkauan" className="border-b border-line bg-mist">
        <div className="wrap py-12 sm:py-16">
          <h2 id="form-jangkauan" className="sr-only">
            Form cek jangkauan
          </h2>
          <CoverageChecker note={coverageSampleNote} variant="full" />
        </div>
      </section>

      <section aria-labelledby="area-contoh" className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="area-contoh" className="text-2xl">
                Daftar area
              </h2>
              <p className="measure mt-3 text-sm leading-relaxed text-muted">{coverageSampleNote}</p>
            </div>
            {COVERAGE_IS_SAMPLE ? (
              <p className="shrink-0 rounded border border-blue px-3 py-1.5 text-xs font-semibold text-blue">
                Data contoh
              </p>
            ) : null}
          </div>

          <div className="mt-6 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <caption className="sr-only">Daftar area contoh dan status ketersediaan</caption>
              <thead>
                <tr className="bg-mist text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-ink">
                    Kecamatan
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-ink">
                    Kelurahan
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-ink">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {areas.map((area) => (
                  <tr key={`${area.kecamatan}-${area.kelurahan}`}>
                    <td className="px-4 py-3 text-muted">{area.kecamatan}</td>
                    <td className="px-4 py-3 text-ink">{area.kelurahan}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${statusClass[area.status]}`}
                      >
                        {statusLabel[area.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="peta-area" className="border-b border-line bg-mist">
        <div className="wrap py-12 sm:py-16">
          <h2 id="peta-area" className="sr-only">
            Peta area jangkauan
          </h2>
          <CoverageMap areas={areas} points={points} />
        </div>
      </section>

      <CtaBand phoneDisplay={company.phoneDisplay} />
    </>
  );
}
