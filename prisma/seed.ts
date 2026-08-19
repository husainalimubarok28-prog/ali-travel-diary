import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import {
  countries,
  testimonials,
  videos,
  blogPosts,
  travelStatistics,
  timelineEvents,
  visaInfoList,
  packingItems,
  faqStudentImmersion,
} from "../src/data/countries";
import { serializeCountry } from "../src/lib/countryUtils";

const prisma = new PrismaClient();

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const CMS_CONTENT: { key: string; value: string; category: string }[] = [
  { key: "countries_title", value: "Countries Explorer", category: "countries" },
  { key: "countries_subtitle", value: "Negara-negara dengan cerita uniknya masing-masing", category: "countries" },
];

const SETTINGS: Record<string, unknown> = {
  hero: {
    title: "Jelajahi Dunia Bersama Ali",
    subtitle: "21 Negara • 10 Bulan • Tak Terlupakan",
    cta: "Mulai Jelajahi",
    cta2: "Lihat Timeline",
  },
  travelStatistics,
  featuredStory: {
    title: "Backpacking 21 Negara dalam 10 Bulan",
    excerpt:
      "Bagaimana saya bisa mengunjungi 21 negara dalam 10 bulan dengan budget terbatas. Tips, trik, dan pelajaran berharga dari perjalanan yang mengubah hidup.",
    image: "",
    slug: "backpacking-21-negara-10-bulan",
    buttonLabel: "Baca Cerita Lengkap",
  },
  partners: ["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5"],
  galleryPreview: [
    "Egypt",
    "Turkey",
    "Nepal",
    "Morocco",
    "Vietnam",
    "Thailand",
    "Germany",
    "Japan",
  ],
  timelineEvents,
  visaInfo: visaInfoList,
  packingItems,
  faqImmersion: faqStudentImmersion,
  newsletter: {
    title: "Langganan Newsletter",
    subtitle: "Dapatkan update perjalanan terbaru langsung di email Anda",
    placeholder: "Masukkan email Anda",
    cta: "Langganan",
  },
};

async function main() {
  const hashedPassword = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "husainalimubarok28@gmail.com" },
    update: {},
    create: {
      email: "husainalimubarok28@gmail.com",
      name: "Husain Ali Mubarok",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Countries
  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    const data: Record<string, unknown> = {
      ...serializeCountry(c),
      nameId: c.nameId,
      displayOrder: i,
    };
    await prisma.countryData.upsert({
      where: { slug: c.slug },
      update: data as never,
      create: { ...data, slug: c.slug } as never,
    });
  }
  console.log(`Countries seeded: ${countries.length}`);

  // Cities
  for (const c of countries) {
    for (const city of c.cities) {
      const data = {
        name: city.name,
        countrySlug: c.slug,
        countryName: c.name,
        description: city.description,
        heroImage: city.heroImage || null,
        budget: city.budget,
        duration: city.duration || "",
        highlights: city.highlights.join("\n"),
        coordinates: JSON.stringify(city.coordinates || []),
      };
      await prisma.city.upsert({
        where: { slug: city.slug },
        update: data,
        create: { ...data, slug: city.slug },
      });
    }
  }
  console.log("Cities seeded");

  // Videos
  for (const v of videos) {
    const data = {
      title: v.title,
      url: v.url,
      platform: v.platform,
      thumbnail: v.thumbnail || null,
      country: v.country,
      duration: v.duration || "",
      views: v.views,
      publishedAt: new Date(v.publishedAt),
    };
    await prisma.video.upsert({
      where: { id: v.id },
      update: data,
      create: { ...data, id: v.id },
    });
  }
  console.log(`Videos seeded: ${videos.length}`);

  // Blog posts
  for (const p of blogPosts) {
    const data = {
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage || "",
      category: p.category,
      publishedAt: new Date(p.publishedAt),
      readingTime: p.readingTime,
      tags: p.tags.join(","),
      featured: p.featured,
      published: true,
      authorId: admin.id,
    };
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, slug: p.slug },
    });
  }
  console.log(`Blog posts seeded: ${blogPosts.length}`);

  // Testimonials
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    const data = {
      name: t.name,
      role: t.role,
      avatar: t.avatar || "",
      content: t.content,
      rating: t.rating,
      displayOrder: i,
    };
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: data,
      create: { ...data, id: t.id },
    });
  }
  console.log(`Testimonials seeded: ${testimonials.length}`);

  // CMS Content Blocks
  for (const item of CMS_CONTENT) {
    const id = uid();
    await prisma.$executeRawUnsafe(
      `INSERT OR IGNORE INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)`,
      id, item.key, item.value, item.category
    );
  }
  console.log(`CMS content blocks seeded: ${CMS_CONTENT.length}`);

  console.log("\nAdmin user:", admin.email);
  console.log("Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
