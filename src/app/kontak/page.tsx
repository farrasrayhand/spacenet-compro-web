import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { getCompany } from "@/lib/data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Alamat kantor, WhatsApp, dan jam operasional SpaceNet di Samarinda Ilir, Kalimantan Timur.",
  alternates: { canonical: "/kontak" },
};

/** Bounding box kecil di sekitar Jl. Jelawat, Samarinda Ilir. */
const osmEmbedUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=117.1508%2C-0.5075%2C117.1688%2C-0.4928&layer=mapnik&marker=-0.500151%2C117.159848";

export default async function KontakPage() {
  const company = await getCompany();

  const waUrl = buildWhatsAppUrl({
    text: "Halo SpaceNet, saya mau bertanya tentang layanan internet di Samarinda.",
  });

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm font-semibold text-bluetext">Kontak</p>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">Hubungi SpaceNet</h1>
          <p className="measure mt-5 text-base leading-relaxed text-muted">
            Kantor kami berada di Samarinda Ilir. Untuk respons tercepat, gunakan WhatsApp.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-mist">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-line bg-surface p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
                <div>
                  <h2 className="text-base font-semibold not-italic text-ink">Kantor pusat</h2>
                  <address className="mt-2 space-y-0.5 text-sm not-italic leading-relaxed text-muted">
                    {company.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-surface p-5">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
                <div>
                  <h2 className="text-base font-semibold not-italic text-ink">Telepon dan WhatsApp</h2>
                  <p className="mt-2 text-sm text-muted">{company.phoneDisplay}</p>
                  <p className="mt-1 text-xs text-muted">{company.emergencySupport}.</p>
                  <ButtonLink href={waUrl} external size="md" className="mt-3">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Chat WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-surface p-5">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
                <div>
                  <h2 className="text-base font-semibold not-italic text-ink">Jam operasional</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{company.hours}</p>
                  <p className="mt-1 text-xs text-muted">
                    Kunjungan kantor sebaiknya dikonfirmasi lebih dulu lewat WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {company.email === null ? (
              <p className="rounded-lg border border-dashed border-line p-4 text-xs leading-relaxed text-muted">
                TODO: alamat email resmi belum dikonfirmasi, jadi belum dicantumkan di halaman ini.
              </p>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <iframe
              title="Lokasi kantor SpaceNet di Jl. Jelawat, Samarinda Ilir"
              src={osmEmbedUrl}
              className="h-80 w-full lg:h-full lg:min-h-[26rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="border-t border-line px-4 py-3 text-xs text-muted">
              Peta oleh OpenStreetMap contributors. Titik penanda menunjukkan Jl. Jelawat, Samarinda
              Ilir.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
