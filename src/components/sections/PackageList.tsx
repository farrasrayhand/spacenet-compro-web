import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { formatRupiah } from "@/lib/format";
import { buildSubscribeUrl } from "@/lib/whatsapp";
import type { Package } from "@/types";

type PackageListProps = {
  packages: Package[];
};

export function PackageList({ packages }: PackageListProps) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {packages.map((pkg) => (
        <li
          key={pkg.id}
          className={`flex flex-col rounded-lg border bg-surface p-5 ${
            pkg.highlight ? "border-blue ring-1 ring-blue" : "border-line"
          }`}
        >
          <div className="flex h-6 items-center">
            {pkg.highlight ? (
              <span className="rounded bg-blue px-2 py-0.5 text-xs font-semibold text-onblue">
                Paling populer
              </span>
            ) : pkg.badge && pkg.badge !== pkg.name ? (
              <span className="rounded border border-line px-2 py-0.5 text-xs font-semibold text-muted">
                {pkg.badge}
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 text-lg font-bold not-italic text-ink">{pkg.name}</h3>

          <p className="mt-3 flex items-baseline gap-1">
            <span className="font-heading text-4xl font-extrabold italic tabular-nums text-ink">
              {pkg.speedMbps}
            </span>
            <span className="text-sm font-medium text-muted">Mbps</span>
          </p>

          <p className="mt-2 text-sm text-muted">
            <span className="font-heading text-xl font-bold italic tabular-nums text-ink">
              {formatRupiah(pkg.pricePerMonth)}
            </span>
            /bulan
          </p>

          <ul className="mt-4 flex-1 space-y-2 border-t border-line pt-4 text-sm">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <ButtonLink
              href={buildSubscribeUrl(pkg)}
              external
              fullWidth
              variant={pkg.highlight ? "primary" : "secondary"}
            >
              Berlangganan
            </ButtonLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
