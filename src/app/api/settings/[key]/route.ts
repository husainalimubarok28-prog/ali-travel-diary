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

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const KEY_MAP: Record<string, Record<string, string>> = {
  hero: { title: "hero_title", subtitle: "hero_subtitle", cta: "hero_cta", cta2: "hero_cta2" },
  featuredStory: { title: "featured_heading", excerpt: "featured_text", buttonLabel: "featured_cta" },
  newsletter: { title: "newsletter_title", subtitle: "newsletter_subtitle", placeholder: "newsletter_placeholder", cta: "newsletter_cta" },
};

export async function PUT(request: Request, { params }: { params: { key: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = getClient();
  try {
    const key = params.key;
    const body = await request.json();
    await client.execute(`CREATE TABLE IF NOT EXISTS SiteContent (
      id TEXT PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general', updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    if (key === "hero" || key === "featuredStory" || key === "newsletter") {
      const map = KEY_MAP[key];
      for (const [field, cmsKey] of Object.entries(map)) {
        if (body[field] !== undefined) {
          const val = typeof body[field] === "object" ? JSON.stringify(body[field]) : String(body[field]);
          const existing = await client.execute({ sql: "SELECT 1 FROM SiteContent WHERE key = ?", args: [cmsKey] });
          if (existing.rows.length > 0) {
            await client.execute({ sql: "UPDATE SiteContent SET value = ? WHERE key = ?", args: [val, cmsKey] });
          } else {
            await client.execute({ sql: "INSERT INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)", args: [uid(), cmsKey, val, "home"] });
          }
        }
      }
    } else if (key === "travelStatistics") {
      const val = JSON.stringify(body);
      const existing = await client.execute({ sql: "SELECT 1 FROM SiteContent WHERE key = ?", args: ["stats"] });
      if (existing.rows.length > 0) {
        await client.execute({ sql: "UPDATE SiteContent SET value = ? WHERE key = ?", args: [val, "stats"] });
      } else {
        await client.execute({ sql: "INSERT INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)", args: [uid(), "stats", val, "stats"] });
      }
    } else if (key === "partners") {
      const val = JSON.stringify(body);
      const existing = await client.execute({ sql: "SELECT 1 FROM SiteContent WHERE key = ?", args: ["partners_list"] });
      if (existing.rows.length > 0) {
        await client.execute({ sql: "UPDATE SiteContent SET value = ? WHERE key = ?", args: [val, "partners_list"] });
      } else {
        await client.execute({ sql: "INSERT INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)", args: [uid(), "partners_list", val, "home"] });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
