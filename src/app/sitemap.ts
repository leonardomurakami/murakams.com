import type { MetadataRoute } from "next";
import { siteConfig } from "@/design/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/infra", "/playground", "/resume", "/contact"];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
