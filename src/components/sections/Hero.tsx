import { ArrowRight, MapPin, Rocket } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

type HeroProps = {
  promoActive: boolean;
  promoNote: string;
};

export function Hero({ promoActive, promoNote }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="wrap grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted">
            <MapPin className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
            Samarinda, Kalimantan Timur
          </p>

          <h1 className="mt-5 text-3xl leading-[1.15] sm:text-4xl lg:text-5xl">
            Internet fiber dan wireless untuk rumah dan bisnis di Samarinda
          </h1>

          <p className="measure mt-5 text-base leading-relaxed text-muted sm:text-lg">
            SpaceNet melayani pemasangan internet rumah dan bisnis dengan jaringan fiber dan
            wireless. Cek ketersediaan di area Anda, lalu pilih paket yang sesuai.
            {promoActive ? ` Saat ini berlaku ${promoNote.toLowerCase()}.` : ""}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/jangkauan" size="lg">
              Cek jangkauan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/paket" variant="secondary" size="lg">
              Lihat paket
            </ButtonLink>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted">Paket mulai</dt>
              <dd className="mt-1 font-heading text-lg font-bold italic text-ink">Rp170.000</dd>
            </div>
            <div>
              <dt className="text-muted">Kecepatan</dt>
              <dd className="mt-1 font-heading text-lg font-bold italic text-ink">30-100 Mbps</dd>
            </div>
            <div>
              <dt className="text-muted">Jaringan</dt>
              <dd className="mt-1 font-heading text-lg font-bold italic text-ink">Fiber &amp; wireless</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-[12%] rounded-full border border-line" />
          <div className="absolute inset-[26%] rounded-full border border-line opacity-70" />

          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
            <g className="orbit-spin">
              <ellipse
                cx="200"
                cy="200"
                rx="190"
                ry="74"
                fill="none"
                stroke="var(--sky)"
                strokeWidth="1.5"
                transform="rotate(-28 200 200)"
                opacity="0.7"
              />
              <circle cx="352" cy="110" r="7" fill="var(--sky)" />
            </g>
            <g className="orbit-spin-slow">
              <ellipse
                cx="200"
                cy="200"
                rx="150"
                ry="150"
                fill="none"
                stroke="var(--blue)"
                strokeWidth="1"
                strokeDasharray="3 9"
                opacity="0.55"
              />
              <circle cx="200" cy="50" r="5" fill="var(--blue)" />
            </g>
            <circle cx="200" cy="200" r="10" fill="var(--blue)" />
          </svg>

          <div className="orbit-rocket">
            <span className="rocket-unit">
              <span className="rocket-flame" />
              <Rocket className="h-6 w-6 text-blue" strokeWidth={2} aria-hidden="true" />
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="card w-[68%] p-5 text-center">
              <p className="text-xs font-semibold text-muted">SpaceNet WiFi</p>
              <p className="mt-1 font-heading text-2xl font-extrabold italic text-ink">
                Tanpa batas FUP
              </p>
              <p className="mt-1 text-xs text-muted">Fiber dan wireless di Samarinda</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
