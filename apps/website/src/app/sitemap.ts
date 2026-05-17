import type { MetadataRoute } from "next";

const siteUrl = "https://www.divergentsolutionsllc.com";
const launchRoutes = [
  "",
  "/gutter-installation",
  "/services",
  "/work",
  "/reviews",
  "/about",
  "/request-a-quote",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return launchRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-05-17"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
