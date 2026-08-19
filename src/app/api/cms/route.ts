import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient, Client } from "@libsql/client";

export const dynamic = "force-dynamic";

function getClient(): Client {
  return createClient({
    url: process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const DEFAULTS: { key: string; value: string; category: string }[] = [
  // HOME - Hero
  { key: "hero_title", value: "Jelajahi Dunia Bersama Ali", category: "home" },
  { key: "hero_subtitle", value: "Backpacker | Content Creator | Student Immersion | 21 Negara", category: "home" },
  { key: "hero_cta", value: "Mulai Eksplorasi", category: "home" },
  { key: "hero_cta2", value: "Lihat Timeline", category: "home" },

  // HOME - Featured
  { key: "featured_title", value: "Cerita Terbaru", category: "home" },
  { key: "featured_heading", value: "Backpacking 21 Negara dalam 10 Bulan", category: "home" },
  { key: "featured_text", value: "Bagaimana seorang backpacker Indonesia bisa menjelajahi 21 negara dalam 10 bulan dengan budget terbatas. Tips, trik, dan pelajaran berharga dari perjalanan yang mengubah hidup.", category: "home" },
  { key: "featured_cta", value: "Baca Cerita Lengkap", category: "home" },

  // HOME - Newsletter
  { key: "newsletter_title", value: "Newsletter", category: "home" },
  { key: "newsletter_subtitle", value: "Dapatkan tips backpacking, budget guide, dan cerita perjalanan terbaru langsung di inbox kamu.", category: "home" },
  { key: "newsletter_cta", value: "Subscribe", category: "home" },
  { key: "newsletter_placeholder", value: "Masukkan email kamu", category: "home" },

  // HOME - Student Immersion CTA
  { key: "immersion_cta_title", value: "Student Immersion Program", category: "home" },
  { key: "immersion_cta_desc", value: "Program edukasi traveling yang menggabungkan belajar dan menjelajahi budaya lokal di berbagai negara.", category: "home" },

  // HOME - Partners
  { key: "partners_title", value: "Didukung oleh", category: "home" },
  { key: "partners_list", value: JSON.stringify(["TravelMate", "Backpacker ID", "EduTravel", "Global Youth"]), category: "home" },

  // HOME - Gallery preview
  { key: "gallery_preview_title", value: "Galeri Perjalanan", category: "home" },

  // HOME - Blog preview
  { key: "blog_preview_title", value: "Artikel Terbaru", category: "home" },

  // HOME - Video preview
  { key: "video_preview_title", value: "Video Terbaru", category: "home" },

  // HOME - Testimonials
  { key: "testimonial_title", value: "Kata Mereka", category: "home" },

  // ABOUT
  { key: "about_title", value: "Tentang Ali", category: "about" },
  { key: "about_subtitle", value: "Bukan sekadar biodata. Ini adalah cerita tentang mimpi, keberanian, dan petualangan tanpa batas.", category: "about" },
  { key: "about_who_title", value: "Siapa Ali?", category: "about" },
  { key: "about_who_content", value: JSON.stringify([
    "Husain Ali Mubarok, seorang backpacker Indonesia yang telah menjelajahi 21 negara dalam 10 bulan.",
    "Berawal dari rasa penasaran yang besar terhadap dunia, Ali memutuskan untuk mengambil langkah pertama sebagai backpacker solo. Dari Indonesia, ia melangkah ke Malaysia, Mesir, dan seterusnya hingga 21 negara.",
    "Selain traveling, Ali juga aktif dalam program Student Immersion, mengajar di sekolah-sekolah lokal di berbagai negara, membuktikan bahwa traveling bisa menjadi sarana edukasi dan berbagi ilmu.",
    "Dengan semangat berbagi cerita dan pengalaman, Ali mendirikan website ini sebagai platform untuk menginspirasi lebih banyak orang untuk berani menjelajahi dunia."
  ]), category: "about" },

  // ABOUT - 3 Cards
  { key: "about_card1_title", value: "Rasa Ingin Tahu", category: "about" },
  { key: "about_card1_desc", value: "Semuanya bermula dari rasa ingin tahu yang besar tentang dunia di luar sana. Setiap buku yang dibaca dan film yang ditonton semakin memperbesar keinginan untuk melihat langsung keajaiban dunia.", category: "about" },
  { key: "about_card2_title", value: "Backpacker Pertama", category: "about" },
  { key: "about_card2_desc", value: "Backpacking pertama ke Malaysia dengan budget minim dan persiapan yang pas-pasan. Dari sanalah semua dimulai - perjalanan yang mengubah cara pandang tentang dunia.", category: "about" },
  { key: "about_card3_title", value: "Mengajar Sambil Traveling", category: "about" },
  { key: "about_card3_desc", value: "Mengajar di sekolah-sekolah lokal sambil traveling, menggabungkan passion untuk edukasi dan petualangan. Student Immersion menjadi program unggulan.", category: "about" },

  // ABOUT - Mission
  { key: "about_mission_title", value: "Misi ke Depan", category: "about" },
  { key: "about_mission_text", value: "Ali berencana untuk terus menjelajahi lebih banyak negara, mengembangkan Student Immersion program, dan menciptakan platform edukasi traveling yang bermanfaat bagi banyak orang.", category: "about" },
  { key: "about_mission_card1_title", value: "50 Countries", category: "about" },
  { key: "about_mission_card1_desc", value: "Target menjelajahi 50 negara", category: "about" },
  { key: "about_mission_card2_title", value: "Ali Travel Academy", category: "about" },
  { key: "about_mission_card2_desc", value: "Kursus backpacking online", category: "about" },
  { key: "about_mission_card3_title", value: "Global Community", category: "about" },
  { key: "about_mission_card3_desc", value: "Membangun komunitas traveler Indonesia", category: "about" },

  // STATS
  { key: "stats", value: JSON.stringify([
    { label: "Negara Dikunjungi", value: "21", icon: "🌍" },
    { label: "Kota Dikunjungi", value: "25+", icon: "🏙" },
    { label: "Penerbangan", value: "15", icon: "✈️" },
    { label: "Perjalanan Darat", value: "20", icon: "🚌" },
    { label: "Total Kilometer", value: "50.000+", icon: "🛣" },
    { label: "Foto & Video", value: "8.000+", icon: "📸" },
    { label: "Video", value: "200+", icon: "🎥" },
    { label: "Total Biaya", value: "Rp200jt+", icon: "💰" },
    { label: "Kuliner Dicoba", value: "300+", icon: "🍜" },
    { label: "Artikel", value: "50+", icon: "📖" }
  ]), category: "stats" },

  // TIMELINE
  { key: "timeline_title", value: "Timeline Perjalanan", category: "timeline" },
  { key: "timeline_subtitle", value: "Perjalanan demi perjalanan yang membentuk cerita hidup", category: "timeline" },

  // CONTACT
  { key: "contact_title", value: "Hubungi Ali", category: "contact" },
  { key: "contact_subtitle", value: "Punya pertanyaan atau mau kerja sama? Jangan ragu untuk menghubungi!", category: "contact" },

  // MAP
  { key: "map_title", value: "Peta Perjalanan", category: "map" },
  { key: "map_subtitle", value: "Negara-negara yang telah dijelajahi dalam satu peta interaktif", category: "map" },

  // BUDGET
  { key: "budget_title", value: "Budget Calculator", category: "budget" },
  { key: "budget_subtitle", value: "Hitung estimasi budget perjalanan ke berbagai negara", category: "budget" },

  // GALLERY
  { key: "gallery_title", value: "Galeri Perjalanan", category: "gallery" },
  { key: "gallery_subtitle", value: "Momen-momen indah dari 21 negara yang dijelajahi", category: "gallery" },

  // BLOG
  { key: "blog_title", value: "Blog Perjalanan", category: "blog" },
  { key: "blog_subtitle", value: "Cerita, tips, dan panduan backpacking dari pengalaman langsung", category: "blog" },

  // VIDEO
  { key: "video_title", value: "Video Perjalanan", category: "video" },
  { key: "video_subtitle", value: "Dokumentasi video dari perjalanan di berbagai negara", category: "video" },

  // CHECKLIST
  { key: "checklist_title", value: "Backpacking Checklist", category: "checklist" },
  { key: "checklist_subtitle", value: "Daftar perlengkapan yang wajib dibawa saat backpacking", category: "checklist" },

  // PACKING
  { key: "packing_title", value: "Packing Generator", category: "packing" },
  { key: "packing_subtitle", value: "Buat daftar packing otomatis berdasarkan destinasi dan durasi", category: "packing" },

  // VISA
  { key: "visa_title", value: "Visa Center", category: "visa" },
  { key: "visa_subtitle", value: "Informasi visa untuk berbagai negara tujuan", category: "visa" },

  // IMMERSION
  { key: "immersion_title", value: "Student Immersion", category: "immersion" },
  { key: "immersion_subtitle", value: "Program edukasi traveling untuk pelajar dan mahasiswa", category: "immersion" },

  // RESOURCES
  { key: "resources_title", value: "Travel Resources", category: "resources" },
  { key: "resources_subtitle", value: "Kumpulan tips dan panduan untuk backpacker pemula", category: "resources" },

  // STATISTICS PAGE
  { key: "statistics_title", value: "Statistik Perjalanan", category: "statistics" },
  { key: "statistics_subtitle", value: "Data dan angka dari perjalanan 21 negara", category: "statistics" },

  // ROADMAP
  { key: "roadmap_title", value: "Roadmap Perjalanan", category: "roadmap" },
  { key: "roadmap_subtitle", value: "Rencana perjalanan ke depan dan target yang ingin dicapai", category: "roadmap" },

  // COMMUNITY
  { key: "community_title", value: "Komunitas Traveler", category: "community" },
  { key: "community_subtitle", value: "Bergabung dengan komunitas backpacker Indonesia", category: "community" },

  // SEARCH
  { key: "search_title", value: "Cari", category: "search" },

  // JOURNAL
  { key: "journal_title", value: "Journal Harian", category: "journal" },
  { key: "journal_subtitle", value: "Catatan harian dari perjalanan di berbagai negara", category: "journal" },

  // AI ASK ALI
  { key: "ai_title", value: "AI Ask Ali", category: "ai" },
  { key: "ai_subtitle", value: "Tanya apa saja tentang backpacking dan perjalanan", category: "ai" },

  // CALCULATOR
  { key: "calculator_title", value: "Budget Calculator", category: "calculator" },
  { key: "calculator_subtitle", value: "Hitung estimasi budget perjalanan kamu", category: "calculator" },

  // GENERAL
  { key: "site_name", value: "Ali Travel Diary", category: "general" },
  { key: "site_tagline", value: "Jelajahi Dunia Bersama Ali", category: "general" },
  { key: "footer_tagline", value: "Backpacking 21 Negara | 25+ Kota | 8.000+ Foto & Video", category: "general" },
  { key: "footer_rights", value: "Hak cipta dilindungi", category: "general" },
  { key: "footer_made", value: "Dibuat dengan ❤️ oleh Ali", category: "general" },
];

async function ensureTable(client: Client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS SiteContent (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedDefaults(client: Client) {
  await ensureTable(client);
  for (const item of DEFAULTS) {
    const existing = await client.execute({ sql: "SELECT 1 FROM SiteContent WHERE key = ?", args: [item.key] });
    if (existing.rows.length === 0) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)",
        args: [uid(), item.key, item.value, item.category],
      });
    }
  }
}

async function fetchAll(client: Client) {
  const result = await client.execute("SELECT key, value, category FROM SiteContent ORDER BY category, key");
  const grouped: Record<string, { key: string; value: string }[]> = {};
  for (const row of result.rows) {
    const cat = String(row.category || "general");
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ key: String(row.key), value: String(row.value) });
  }
  return grouped;
}

export async function GET() {
  const client = getClient();
  try {
    await ensureTable(client);
    let data = await fetchAll(client);
    if (Object.keys(data).length === 0) {
      await seedDefaults(client);
      data = await fetchAll(client);
    }
    return NextResponse.json(data);
  } catch (e) {
    try {
      await seedDefaults(client);
      return NextResponse.json(await fetchAll(client));
    } catch {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
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
    const existing = await client.execute({ sql: "SELECT 1 FROM SiteContent WHERE key = ?", args: [key] });

    if (existing.rows.length > 0) {
      await client.execute({ sql: "UPDATE SiteContent SET value = ? WHERE key = ?", args: [value, key] });
    } else {
      const cat = DEFAULTS.find(d => d.key === key)?.category || "general";
      await client.execute({ sql: "INSERT INTO SiteContent (id, key, value, category) VALUES (?, ?, ?, ?)", args: [uid(), key, value, cat] });
    }
    return NextResponse.json({ success: true, key });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
