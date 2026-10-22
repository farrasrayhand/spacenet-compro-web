import type { Metadata, Viewport } from "next";
import { Exo_2, Figtree } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { RouteFocus } from "@/components/layout/RouteFocus";

import { getCompany, getPackages, getPromo, getSocialLinks } from "@/lib/data";

const exo = Exo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
  variable: "--font-exo",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  display: "swap",
});

const SITE_URL = "https://www.spacenetworkmediatama.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SpaceNet — Internet Samarinda, fiber dan wireless",
    template: "%s — SpaceNet",
  },
  description:
    "SpaceNet menyediakan internet fiber dan wireless untuk rumah dan bisnis di Samarinda, Kalimantan Timur. Paket 30 sampai 100 Mbps, tanpa batas FUP, gratis pemasangan selama promo.",
  keywords: [
    "internet Samarinda",
    "wifi Samarinda",
    "internet fiber Samarinda",
    "pasang wifi Samarinda",
    "SpaceNet",
    "PT. Space Network Mediatama",
  ],
  applicationName: "SpaceNet",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "SpaceNet",
    title: "SpaceNet — Internet Samarinda, fiber dan wireless",
    description:
      "Internet fiber dan wireless untuk rumah dan bisnis di Samarinda. Empat paket 30-100 Mbps, tanpa batas FUP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpaceNet — Internet Samarinda",
    description: "Internet fiber dan wireless untuk rumah dan bisnis di Samarinda.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F8FC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E13" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [companyData, promoData, packages, socialLinks] = await Promise.all([
    getCompany(),
    getPromo(),
    getPackages(),
    getSocialLinks(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: companyData.brand,
    legalName: companyData.legalName,
    url: SITE_URL,
    telephone: `+${companyData.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Jelawat gg 9 no 11",
      addressLocality: "Samarinda",
      addressRegion: "Kalimantan Timur",
      postalCode: "75114",
      addressCountry: "ID",
    },
    areaServed: { "@type": "City", name: "Samarinda" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  };

  return (
    <html lang="id" className={`${exo.variable} ${figtree.variable}`}>
      <body>
        <a href="#konten" className="skip-link">
          Lewati ke konten utama
        </a>

        {promoData.active ? (
          <PromoBanner label={promoData.label} note={promoData.note} />
        ) : null}

        <Header />
        <RouteFocus />

        <main id="konten" tabIndex={-1} className="outline-none">
          {children}
        </main>

        <Footer company={companyData} packages={packages} socialLinks={socialLinks} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
