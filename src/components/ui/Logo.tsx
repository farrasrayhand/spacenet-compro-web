import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  href?: string | null;
  /** Tinggi tampilan (px). Lebar mengikuti rasio asli 400x96. */
  height?: number;
};

/**
 * Logo resmi dari klien.
 * Dua varian: light (wordmark hitam) dan dark (wordmark putih, biru tetap),
 * dipilih lewat prefers-color-scheme di globals.css. Versi dark dibuat dari
 * file asli, bukan dibalik dengan filter, supaya warna biru brand tidak berubah.
 * TODO: minta file vektor (SVG) dari klien agar tajam di semua ukuran.
 */
export function Logo({ className = "", href = "/", height = 36 }: LogoProps) {
  const content = (
    <span className="inline-flex items-center">
      <Image
        src="/logo-spacenet-light.png"
        alt="SpaceNet — PT. Space Network Mediatama"
        width={400}
        height={96}
        priority
        className="logo-on-light w-auto"
        style={{ height }}
      />
      <Image
        src="/logo-spacenet-dark.png"
        alt=""
        aria-hidden="true"
        width={400}
        height={96}
        className="logo-on-dark w-auto"
        style={{ height }}
      />
    </span>
  );

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center rounded transition-opacity hover:opacity-80 ${className}`}
      aria-label="SpaceNet — kembali ke beranda"
    >
      {content}
    </Link>
  );
}
