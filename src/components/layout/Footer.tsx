import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { navItems } from "@/lib/nav";
import { formatRupiah } from "@/lib/format";
import type { Company, Package } from "@/types";

type FooterProps = {
  company: Company;
  packages: Package[];
  socialLinks: { label: string; href: string }[];
};

export function Footer({ company, packages, socialLinks }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-mist">
      <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="measure mt-4 text-sm leading-relaxed text-muted">
            {company.legalName}. Penyedia jaringan internet fiber dan wireless untuk rumah dan bisnis
            di Samarinda, Kalimantan Timur.
          </p>
        </div>

        <nav aria-label="Tautan cepat">
          <h2 className="text-sm font-bold text-ink">Tautan cepat</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1 text-muted hover:text-blue">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/daftar" className="inline-block py-1 text-muted hover:text-blue">
                Daftar berlangganan
              </Link>
            </li>
            <li>
              <Link href="/privasi" className="inline-block py-1 text-muted hover:text-blue">
                Kebijakan privasi
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-ink">Layanan</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {packages.map((pkg) => (
              <li key={pkg.id}>
                <Link href={`/daftar?paket=${pkg.id}`} className="inline-block py-1 text-muted hover:text-blue">
                  {pkg.name} — {pkg.speedMbps} Mbps — {formatRupiah(pkg.pricePerMonth)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-ink">Kontak</h2>
          <address className="mt-3 space-y-1 text-sm not-italic text-muted">
            {company.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-3 text-sm text-muted">
            WhatsApp:{" "}
            <a
              href={`https://wa.me/${company.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:text-blue"
            >
              {company.phoneDisplay}
            </a>
          </p>
          <p className="mt-1 text-sm text-muted">{company.hours}</p>

          {socialLinks.length > 0 ? (
            <ul className="mt-3 flex gap-3 text-sm">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-blue"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. Seluruh hak cipta dilindungi.
          </p>
          <p>Internet Samarinda — fiber dan wireless.</p>
        </div>
      </div>
    </footer>
  );
}
