import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { RegistrationForm } from "@/components/sections/RegistrationForm";
import { COVERAGE_IS_SAMPLE, coverageSampleNote } from "@/data/coverage";
import { getPackages } from "@/lib/data";
import type { PackageId } from "@/types";

export const metadata: Metadata = {
  title: "Daftar Berlangganan",
  description:
    "Isi formulir pendaftaran pemasangan internet SpaceNet di Samarinda. Data dikirim ke admin melalui WhatsApp.",
  alternates: { canonical: "/daftar" },
};

const validIds: PackageId[] = ["hemat", "mantap", "ideal", "gamers"];

type PageProps = {
  searchParams: Promise<{ paket?: string }>;
};

export default async function DaftarPage({ searchParams }: PageProps) {
  const [{ paket }, packages] = await Promise.all([searchParams, getPackages()]);

  const requested = validIds.find((id) => id === paket);
  const popular = packages.find((pkg) => pkg.highlight);
  const defaultPackageId: PackageId = requested ?? popular?.id ?? packages[0].id;

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm font-semibold text-bluetext">Pendaftaran</p>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">Daftar berlangganan SpaceNet</h1>
          <p className="measure mt-5 text-base leading-relaxed text-muted">
            Isi data berikut. Setelah tombol kirim ditekan, aplikasi membuka WhatsApp admin dengan
            pesan pendaftaran yang sudah terisi. Admin akan mengonfirmasi ketersediaan jaringan dan
            jadwal pemasangan.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-mist">
        <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-line bg-surface p-5 sm:p-7">
            <h2 className="text-xl">Formulir pendaftaran</h2>
            <p className="mt-2 text-sm text-muted">
              Kolom bertanda <span className="font-semibold text-blue">*</span> wajib diisi.
            </p>
            <div className="mt-6">
              <RegistrationForm packages={packages} defaultPackageId={defaultPackageId} />
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-lg border border-line bg-surface p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold not-italic text-ink">
                <MessageCircle className="h-4 w-4 text-blue" aria-hidden="true" />
                Lewat WhatsApp
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Ingin bertanya dulu sebelum mendaftar? Hubungi admin di 0811-585-255. Support
                darurat tersedia 24 jam.
              </p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-5">
              <h2 className="text-base font-semibold not-italic text-ink">Yang perlu disiapkan</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted">
                <li>Alamat lengkap titik pemasangan</li>
                <li>Nomor WhatsApp aktif</li>
                <li>Konfirmasi ketersediaan area lewat halaman Jangkauan</li>
              </ul>
            </div>

            {COVERAGE_IS_SAMPLE ? (
              <p className="rounded-lg border border-dashed border-line p-4 text-xs leading-relaxed text-muted">
                {coverageSampleNote}
              </p>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}
