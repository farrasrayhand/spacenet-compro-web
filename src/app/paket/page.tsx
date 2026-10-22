import type { Metadata } from "next";
import { PackageList } from "@/components/sections/PackageList";
import { PackageComparison } from "@/components/sections/PackageComparison";
import { Accordion } from "@/components/ui/Accordion";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCompany, getFaqItems, getPackages, getPromo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Paket dan Harga",
  description:
    "Empat paket internet SpaceNet di Samarinda: 30, 50, 75, dan 100 Mbps. Harga mulai Rp170.000 per bulan, tanpa batas FUP, gratis pemasangan selama promo.",
  alternates: { canonical: "/paket" },
};

export default async function PaketPage() {
  const [packages, faqItems, company, promoData] = await Promise.all([
    getPackages(),
    getFaqItems(),
    getCompany(),
    getPromo(),
  ]);

  const paketFaq = faqItems.filter((item) =>
    ["biaya-pemasangan", "ppn", "kontrak", "upload"].includes(item.id),
  );

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm font-semibold text-bluetext">Paket dan harga</p>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl">
            Empat paket internet untuk rumah dan bisnis
          </h1>
          <p className="measure mt-5 text-base leading-relaxed text-muted">
            Semua paket memiliki harga bulanan tetap, tanpa batas FUP, dan gratis pemasangan selama{" "}
            {promoData.label.toLowerCase()}. Harga di bawah sesuai brosur promo terbaru.
          </p>
        </div>
      </section>

      <section aria-labelledby="daftar-paket" className="border-b border-line">
        <div className="wrap py-12 sm:py-16">
          <h2 id="daftar-paket" className="sr-only">
            Daftar paket
          </h2>
          <PackageList packages={packages} />

          <div className="mt-10">
            <h2 className="text-xl">Perbandingan paket</h2>
            <p className="measure mt-2 text-sm text-muted">
              Benefit di bawah ini berlaku untuk seluruh paket sesuai brosur promo.
            </p>
            <div className="mt-5">
              <PackageComparison packages={packages} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-paket" className="border-b border-line bg-mist">
        <div className="wrap py-12 sm:py-16">
          <h2 id="faq-paket" className="text-2xl">
            Pertanyaan seputar paket
          </h2>
          <div className="mt-6 max-w-3xl">
            <Accordion items={paketFaq} />
          </div>
        </div>
      </section>

      <CtaBand phoneDisplay={company.phoneDisplay} />
    </>
  );
}
