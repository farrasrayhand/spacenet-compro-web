import { formatRupiah } from "@/lib/format";
import type { Package } from "@/types";

type PackageComparisonProps = {
  packages: Package[];
};

export function PackageComparison({ packages }: PackageComparisonProps) {
  const featureNames = Array.from(new Set(packages.flatMap((pkg) => pkg.features)));

  return (
    <div>
      {/* Mobile: hanya baris pembeda (nama, kecepatan, harga) — tanpa mengulang benefit */}
      <div className="md:hidden">
        <div className="overflow-hidden rounded-t-lg border border-line">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              Perbandingan kecepatan dan harga paket SpaceNet
            </caption>
            <thead>
              <tr className="bg-mist text-left">
                <th scope="col" className="px-3 py-2.5 font-semibold text-ink">
                  Paket
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold text-ink">
                  Kecepatan
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold text-ink">
                  Harga
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <th scope="row" className="px-3 py-2.5 text-left font-medium text-ink">
                    {pkg.name}
                  </th>
                  <td className="px-3 py-2.5 text-muted">{pkg.speedMbps} Mbps</td>
                  <td className="px-3 py-2.5 font-semibold tabular-nums text-ink">
                    {formatRupiah(pkg.pricePerMonth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-b-lg border-x border-b border-line bg-surface px-4 py-4">
          <p className="text-xs font-semibold text-ink">Benefit yang sama untuk semua paket</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {featureNames.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tablet ke atas: tabel penuh */}
      <div className="hidden overflow-x-auto rounded-lg border border-line md:block">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">Perbandingan paket SpaceNet</caption>
          <thead>
            <tr className="bg-mist text-left">
              <th scope="col" className="px-4 py-3 font-semibold text-ink">
                Paket
              </th>
              {packages.map((pkg) => (
                <th key={pkg.id} scope="col" className="px-4 py-3 font-semibold text-ink">
                  <span className="whitespace-nowrap">{pkg.name}</span>
                  {pkg.highlight ? (
                    <span className="ml-2 whitespace-nowrap rounded bg-blue px-1.5 py-0.5 text-xs font-semibold text-onblue">
                      Paling populer
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <tr>
              <th scope="row" className="px-4 py-3 text-left font-medium text-muted">
                Kecepatan
              </th>
              {packages.map((pkg) => (
                <td key={pkg.id} className="px-4 py-3 font-semibold text-ink">
                  {pkg.speedMbps} Mbps
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="px-4 py-3 text-left font-medium text-muted">
                Harga per bulan
              </th>
              {packages.map((pkg) => (
                <td key={pkg.id} className="px-4 py-3 font-semibold text-ink">
                  {formatRupiah(pkg.pricePerMonth)}
                </td>
              ))}
            </tr>
            {featureNames.map((feature) => (
              <tr key={feature}>
                <th scope="row" className="px-4 py-3 text-left font-medium text-muted">
                  {feature}
                </th>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="px-4 py-3 text-ink">
                    {pkg.features.includes(feature) ? "Termasuk" : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">
        Kecepatan dan harga di atas sesuai brosur promo. Ketersediaan paket dikonfirmasi admin lewat
        WhatsApp.
      </p>
    </div>
  );
}
