import type { SEOMetadata } from "@/types";

const siteUrl = "https://alitraveldiary.com";
const siteName = "Ali Travel Diary";
const defaultDescription = "Jelajahi 21 negara dalam 10 bulan bersama Ali. Backpacking, budget tips, dan cerita perjalanan inspiratif.";

export function generateSEOMetadata(overrides?: Partial<SEOMetadata>): SEOMetadata {
  return {
    title: overrides?.title
      ? `${overrides.title} | Ali Travel Diary`
      : "Ali Travel Diary - 21 Countries in 10 Months",
    description: overrides?.description || defaultDescription,
    keywords: overrides?.keywords || [
      "travel", "backpacking", "ali travel diary", "21 negara", "10 bulan",
      "budget travel", "student immersion", "Indonesia traveler",
    ],
    ogImage: overrides?.ogImage || "/images/og-default.jpg",
    ogType: overrides?.ogType || "website",
    canonical: overrides?.canonical || siteUrl,
  };
}

export function generateJSONLD(type: "website" | "article" | "person" | "blog" | "video", data?: Record<string, unknown>) {
  const base = {
    "@context": "https://schema.org",
    "@type": type === "person" ? "Person" : type === "article" ? "Article" : type === "blog" ? "Blog" : "WebSite",
    "name": siteName,
    "url": siteUrl,
    "description": defaultDescription,
  };

  if (type === "person") {
    return {
      ...base,
      "@type": "Person",
      "givenName": "Husain Ali",
      "familyName": "Mubarok",
      "email": "husainalimubarok28@gmail.com",
      "knowsAbout": ["Travel", "Backpacking", "Education"],
      "nationality": "Indonesian",
    };
  }

  if (type === "blog") {
    return {
      ...base,
      "@type": "Blog",
      "blogPost": data?.posts,
    };
  }

  return { ...base, ...data };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/icons/logo.svg`,
    "sameAs": [
      "https://www.instagram.com/ali.traveldiary",
      "https://www.tiktok.com/@ali.traveldiary",
      "https://www.youtube.com/@husainalimubarok",
      "https://wa.me/6282342023235",
    ],
  };
}
