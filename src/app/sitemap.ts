import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://alitraveldiary.com";

  const pages = [
    "", "/about", "/world-map", "/timeline", "/countries", "/blog", "/gallery",
    "/video", "/budget", "/calculator", "/visa", "/checklist", "/packing-generator",
    "/ai-ask-ali", "/student-immersion", "/resources", "/community", "/contact",
    "/journal", "/search", "/statistics", "/roadmap", "/cms",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "" ? 1 : 0.8,
  }));
}
