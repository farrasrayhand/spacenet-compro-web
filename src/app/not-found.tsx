import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="text-sm font-semibold text-bluetext">Halaman tidak ditemukan</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Alamat ini tidak tersedia</h1>
      <p className="measure mt-4 text-base leading-relaxed text-muted">
        Mungkin tautan sudah berubah. Kembali ke beranda atau lihat paket yang tersedia.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Ke beranda
        </ButtonLink>
        <ButtonLink href="/paket" size="lg" variant="secondary">
          Lihat paket
        </ButtonLink>
      </div>
    </div>
  );
}
