import type { Metadata } from "next";
import { getCompany } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Bagaimana SpaceNet mengumpulkan, memakai, dan menyimpan data pendaftaran pelanggan.",
  alternates: { canonical: "/privasi" },
};

export default async function PrivasiPage() {
  const company = await getCompany();

  return (
    <div className="wrap py-12 sm:py-16">
      <p className="text-sm font-semibold text-bluetext">Privasi</p>
      <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">Kebijakan privasi</h1>
      <p className="measure mt-4 text-sm text-muted">
        Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}.
      </p>

      <div className="measure mt-8 space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold not-italic text-ink">Data yang kami kumpulkan</h2>
          <p className="mt-2">
            Saat Anda mengisi formulir pendaftaran, kami menerima nama lengkap, nomor WhatsApp,
            alamat pemasangan, paket yang dipilih, rencana tanggal pasang, dan catatan yang Anda
            tulis. Kami tidak meminta data pembayaran melalui situs ini.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold not-italic text-ink">Tujuan penggunaan</h2>
          <p className="mt-2">
            Data dipakai untuk menghubungi Anda, memeriksa ketersediaan jaringan di alamat Anda,
            menjadwalkan pemasangan, dan menindaklanjuti layanan. Data tidak dijual atau dibagikan
            untuk iklan pihak ketiga.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold not-italic text-ink">Penyimpanan dan akses</h2>
          <p className="mt-2">
            Data pendaftaran disimpan pada basis data internal {company.legalName} dan hanya dapat
            diakses oleh admin yang berwenang. Kami menyimpan data selama diperlukan untuk proses
            pendaftaran dan layanan pelanggan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold not-italic text-ink">Permintaan Anda</h2>
          <p className="mt-2">
            Anda dapat meminta salinan, koreksi, atau penghapusan data dengan menghubungi kami di
            WhatsApp {company.phoneDisplay} atau datang ke kantor {company.address}.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold not-italic text-ink">Perubahan kebijakan</h2>
          <p className="mt-2">
            Kebijakan ini dapat diperbarui bila layanan berubah. Versi terbaru selalu tersedia di
            halaman ini.
          </p>
        </section>

        <p className="rounded-lg border border-dashed border-line p-4 text-xs">
          TODO: dokumen ini adalah draf operasional untuk kebutuhan situs. Sebelum dipublikasikan,
          mintakan peninjauan ke penanggung jawab hukum perusahaan.
        </p>
      </div>
    </div>
  );
}
