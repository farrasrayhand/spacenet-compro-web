import type { MetadataRoute } from "next";

const SITE_URL = "https://www.spacenetworkmediatama.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tentang",
    "/paket",
    "/layanan",
    "/jangkauan",
    "/daftar",
    "/bantuan",
    "/kontak",
    "/privasi",
  ];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
