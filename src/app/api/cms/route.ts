import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient, Client } from "@libsql/client";

function getClient(): Client {
  const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  return createClient({ url, authToken });
}

type Row = Record<string, string | number | null | bigint>;

const DEFAULTS: { key: string; value: string; category: string }[] = [
  { key: "hero_title", value: "Jelajahi Dunia Bersama", category: "home" },
  { key: "hero_subtitle", value: "Backpacker | Content Creator | Student Immersion", category: "home" },
  { key: "hero_cta", value: "Mulai Eksplorasi", category: "home" },
  { key: "hero_cta2", value: "Lihat Timeline", category: "home" },
  { key: "featured_title", value: "Cerita Terbaru", category: "home" },
  { key: "featured_heading", value: "Backpacking 21 Negara dalam 10 Bulan", category: "home" },
  { key: "featured_text", value: "Bagaimana saya bisa mengunjungi 21 negara dalam 10 bulan dengan budget terbatas. Tips, trik, dan pelajaran berharga dari perjalanan yang mengubah hidup.", category: "home" },
  { key: "about_who_title", value: "Siapa Ali?", category: "about" },
  { key: "about_who_content", value: JSON.stringify(["Husain Ali Mubarok, seorang backpacker Indonesia yang telah menjelajahi 21 negara dalam 10 bulan.", "Berawal dari rasa penasaran yang besar terhadap dunia, Ali memutuskan untuk mengambil langkah pertama sebagai backpacker solo.", "Selain traveling, Ali juga aktif dalam program Student Immersion."]), category: "about" },
  { key: "about_story_title", value: "Awal Mula", category: "about" },
  { key: "about_story_content", value: JSON.stringify(["Semuanya bermula dari mimpi sederhana: ingin melihat dunia.", "Dari sanalah semuanya dimulai. Negara demi negara ia kunjungi.", "Setiap perjalanan adalah cerita. Setiap cerita adalah pelajaran."]), category: "about" },
  { key: "about_milestones_title", value: "Perjalanan", category: "about" },
  { key: "stats", value: JSON.stringify([{ label: "Negara Dikunjungi", value: 21, icon: "🌍" }, { label: "Kota Dikunjungi", value: "25+", icon: "🏙" }, { label: "Foto & Video", value: "8.000+", icon: "📸" }, { label: "Total Kilometer", value: "50.000+", icon: "🛣" }, { label: "Kuliner Dicoba", value: "300+", icon: "🍜" }, { label: "Total Biaya", value: "Rp200jt+", icon: "💰" }]), category: "stats" },
  { key: "site_name", value: "Ali Travel Diary", category: "general" },
  { key: "site_tagline", value: "Jelajahi Dunia Bersama Ali", category: "general" },
  { key: "footer_tagline", value: "Backpacking 21 Negara | 25+ Kota | 8.000+ Foto & Video", category: "general" },
];

async function ensureTable(client: Client) {
  await client.execute(`CREATE TABLE IF NOT EXISTS SiteContent (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function seedDefaults(client: Client) {
  await ensureTable(client);
  for (const item of DEFAULTS) {
    const existing = await client.execute({
      sql: "SELECT id FROM SiteContent WHERE key = ?",
      args: [item.key],
    });
    if (existing.rows.length === 0) {
      await client.execute({
        sql: "INSERT INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)",
        args: [crypto.randomUUID(), item.key, item.value, item.category],
      });
    }
  }
}

async function fetchGrouped(client: Client) {
  const result = await client.execute("SELECT key, value, category, updatedAt FROM SiteContent ORDER BY category, key");
  const grouped: Record<string, Row[]> = {};
  for (const row of result.rows) {
    const cat = String(row.category || "general");
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ key: String(row.key), value: String(row.value), category: cat, updatedAt: row.updatedAt ? String(row.updatedAt) : "" });
  }
  return grouped;
}

export async function GET() {
  const client = getClient();

  try {
    await ensureTable(client);
    const grouped = await fetchGrouped(client);
    const isEmpty = Object.keys(grouped).length === 0;
    if (isEmpty) {
      await seedDefaults(client);
      return NextResponse.json(await fetchGrouped(client));
    }
    return NextResponse.json(grouped);
  } catch {
    await seedDefaults(client);
    return NextResponse.json(await fetchGrouped(client));
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = getClient();

  try {
    const { key, value } = await request.json();
    if (!key || value === undefined) return NextResponse.json({ error: "key and value required" }, { status: 400 });

    await ensureTable(client);
    const existing = await client.execute({ sql: "SELECT id FROM SiteContent WHERE key = ?", args: [key] });

    if (existing.rows.length > 0) {
      await client.execute({ sql: "UPDATE SiteContent SET value = ?, updatedAt = CURRENT_TIMESTAMP WHERE key = ?", args: [value, key] });
    } else {
      const category = DEFAULTS.find(d => d.key === key)?.category || "general";
      await client.execute({ sql: "INSERT INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)", args: [crypto.randomUUID(), key, value, category] });
    }

    return NextResponse.json({ success: true, key });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
