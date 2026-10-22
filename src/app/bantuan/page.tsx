import type { Metadata } from "next";
import { AlertTriangle, Clock, CreditCard, Headphones } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { getCompany, getFaqItems } from "@/lib/data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Bantuan",
  description:
    "Pertanyaan umum seputar berlangganan, pembayaran, gangguan, dan jangkauan jaringan SpaceNet Samarinda.",
  alternates: { canonical: "/bantuan" },
};

export default async function BantuanPage() {
  const [faqItems, company] = await Promise.all([getFaqItems(), getCompany()]);

  const waUrl = buildWhatsAppUrl({
    text: "Halo SpaceNet, saya butuh bantuan terkait layanan internet.",
  });

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm font-semibold text-bluetext">Bantuan</p>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">Pusat bantuan pelanggan</h1>
          <p className="measure mt-5 text-base leading-relaxed text-muted">
            Temukan jawaban seputar berlangganan, pembayaran, dan gangguan. Jika belum terjawab,
            hubungi kami lewat WhatsApp.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq" className="border-b border-line">
        <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="faq" className="text-2xl">
              Pertanyaan umum
            </h2>
            <p className="measure mt-3 text-sm leading-relaxed text-muted">
              Jawaban yang ditandai TODO belum dikonfirmasi perusahaan, jadi belum kami isi.
            </p>
          </div>
          <div>
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>

      <section aria-labelledby="kanal-bantuan" className="border-b border-line bg-mist">
        <div className="wrap py-12 sm:py-16">
          <h2 id="kanal-bantuan" className="text-2xl">
            Kanal bantuan
          </h2>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li className="rounded-lg border border-line bg-surface p-5">
              <Headphones className="h-5 w-5 text-blue" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold not-italic text-ink">Gangguan jaringan</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Hubungi {company.phoneDisplay}. Sertakan alamat dan gejala gangguan agar teknisi bisa
                menyiapkan penanganan.
              </p>
            </li>
            <li className="rounded-lg border border-line bg-surface p-5">
              <CreditCard className="h-5 w-5 text-blue" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold not-italic text-ink">Pembayaran</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Notifikasi tagihan dan konfirmasi pembayaran dikirim lewat WhatsApp. Metode pembayaran
                yang tersedia dikonfirmasi admin.
              </p>
            </li>
            <li className="rounded-lg border border-line bg-surface p-5">
              <Clock className="h-5 w-5 text-blue" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold not-italic text-ink">Jam layanan</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{company.hours}.</p>
              <p className="mt-2 text-xs text-muted">{company.emergencySupport}.</p>
            </li>
          </ul>

          <div className="mt-8 flex flex-col items-start gap-3 rounded-lg border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-muted">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden="true" />
              Untuk gangguan yang mengganggu pekerjaan, hubungi support darurat 24 jam.
            </p>
            <ButtonLink href={waUrl} external size="md">
              Hubungi WhatsApp
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
