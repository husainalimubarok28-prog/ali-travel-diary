import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@libsql/client";

export const dynamic = "force-dynamic";

function getClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });
}

export async function GET() {
  const client = getClient();
  try {
    await client.execute(`CREATE TABLE IF NOT EXISTS SiteContent (
      id TEXT PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general', updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    const result = await client.execute("SELECT key, value FROM SiteContent");

    const data: Record<string, any> = {};
    for (const row of result.rows) {
      const key = String(row.key);
      const val = String(row.value);
      try { data[key] = JSON.parse(val); } catch { data[key] = val; }
    }

    return NextResponse.json({
      hero: { title: data.hero_title || "", subtitle: data.hero_subtitle || "", cta: data.hero_cta || "", cta2: data.hero_cta2 || "" },
      travelStatistics: Array.isArray(data.stats) ? data.stats : [],
      featuredStory: { title: data.featured_heading || "", excerpt: data.featured_text || "", image: "", slug: "backpacking-21-negara-10-bulan", buttonLabel: data.featured_cta || "Baca Cerita Lengkap" },
      partners: Array.isArray(data.partners_list) ? data.partners_list : [],
      galleryPreview: [],
      newsletter: { title: data.newsletter_title || "", subtitle: data.newsletter_subtitle || "", placeholder: data.newsletter_placeholder || "", cta: data.newsletter_cta || "" },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
