"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type CMSData = Record<string, { key: string; value: string }[]>;

const categoryLabels: Record<string, string> = {
  home: "Halaman Depan",
  about: "Tentang Ali",
  stats: "Statistik",
  timeline: "Timeline",
  contact: "Kontak",
  map: "Peta",
  budget: "Budget",
  gallery: "Galeri",
  blog: "Blog",
  video: "Video",
  checklist: "Checklist",
  packing: "Packing",
  visa: "Visa",
  immersion: "Student Immersion",
  resources: "Resources",
  statistics: "Statistik Page",
  roadmap: "Roadmap",
  community: "Komunitas",
  search: "Pencarian",
  journal: "Journal",
  ai: "AI Ask Ali",
  calculator: "Kalkulator",
  general: "Umum",
};

const fieldNames: Record<string, string> = {
  hero_title: "Judul Utama Hero",
  hero_subtitle: "Subtitle Hero",
  hero_cta: "Tombol CTA 1",
  hero_cta2: "Tombol CTA 2",
  featured_title: "Judul Featured",
  featured_heading: "Heading Cerita",
  featured_text: "Deskripsi Cerita",
  featured_cta: "Tombol CTA",
  newsletter_title: "Judul Newsletter",
  newsletter_subtitle: "Deskripsi Newsletter",
  newsletter_cta: "Tombol Subscribe",
  newsletter_placeholder: "Placeholder Email",
  immersion_cta_title: "Judul CTA Immersion",
  immersion_cta_desc: "Deskripsi CTA Immersion",
  partners_title: "Judul Partners",
  partners_list: "Daftar Partner (JSON array)",
  gallery_preview_title: "Judul Gallery Preview",
  blog_preview_title: "Judul Blog Preview",
  video_preview_title: "Judul Video Preview",
  testimonial_title: "Judul Testimonial",
  about_title: "Judul About",
  about_subtitle: "Subtitle About",
  about_who_title: "Judul Siapa Ali",
  about_who_content: "Konten Siapa Ali",
  about_card1_title: "Judul Card 1",
  about_card1_desc: "Deskripsi Card 1",
  about_card2_title: "Judul Card 2",
  about_card2_desc: "Deskripsi Card 2",
  about_card3_title: "Judul Card 3",
  about_card3_desc: "Deskripsi Card 3",
  about_mission_title: "Judul Misi",
  about_mission_text: "Teks Misi",
  about_mission_card1_title: "Judul Misi 1",
  about_mission_card1_desc: "Deskripsi Misi 1",
  about_mission_card2_title: "Judul Misi 2",
  about_mission_card2_desc: "Deskripsi Misi 2",
  about_mission_card3_title: "Judul Misi 3",
  about_mission_card3_desc: "Deskripsi Misi 3",
  stats: "Data Statistik (JSON)",
  timeline_title: "Judul Timeline",
  timeline_subtitle: "Subtitle Timeline",
  contact_title: "Judul Kontak",
  contact_subtitle: "Subtitle Kontak",
  map_title: "Judul Peta",
  map_subtitle: "Subtitle Peta",
  budget_title: "Judul Budget",
  budget_subtitle: "Subtitle Budget",
  gallery_title: "Judul Galeri",
  gallery_subtitle: "Subtitle Galeri",
  blog_title: "Judul Blog",
  blog_subtitle: "Subtitle Blog",
  video_title: "Judul Video",
  video_subtitle: "Subtitle Video",
  checklist_title: "Judul Checklist",
  checklist_subtitle: "Subtitle Checklist",
  packing_title: "Judul Packing",
  packing_subtitle: "Subtitle Packing",
  visa_title: "Judul Visa",
  visa_subtitle: "Subtitle Visa",
  immersion_title: "Judul Immersion",
  immersion_subtitle: "Subtitle Immersion",
  resources_title: "Judul Resources",
  resources_subtitle: "Subtitle Resources",
  statistics_title: "Judul Statistics",
  statistics_subtitle: "Subtitle Statistics",
  roadmap_title: "Judul Roadmap",
  roadmap_subtitle: "Subtitle Roadmap",
  community_title: "Judul Komunitas",
  community_subtitle: "Subtitle Komunitas",
  search_title: "Judul Search",
  journal_title: "Judul Journal",
  journal_subtitle: "Subtitle Journal",
  ai_title: "Judul AI",
  ai_subtitle: "Subtitle AI",
  calculator_title: "Judul Kalkulator",
  calculator_subtitle: "Subtitle Kalkulator",
  site_name: "Nama Website",
  site_tagline: "Tagline Website",
  footer_tagline: "Tagline Footer",
  footer_rights: "Hak Cipta",
  footer_made: "Dibuat Oleh",
};

function isLongText(key: string) {
  return key.includes("content") || key.includes("text") || key.includes("desc") || key.includes("subtitle") || key.includes("featured_text") || key === "about_mission_text";
}

function isJSON(key: string) {
  return key === "stats" || key === "partners_list" || key.includes("who_content") || key.includes("story_content");
}

export default function CMSPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<CMSData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms");
      const json = await res.json();
      setData(json);
      if (!activeCategory && Object.keys(json).length > 0) {
        setActiveCategory(Object.keys(json)[0]);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (status === "unauthenticated") return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const startEdit = (key: string, value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        if (typeof parsed[0] === "object") {
          setEditValue(JSON.stringify(parsed, null, 2));
        } else {
          setEditValue(parsed.join("\n"));
        }
      } else {
        setEditValue(JSON.stringify(parsed, null, 2));
      }
    } catch {
      setEditValue(value);
    }
    setEditKey(key);
  };

  const save = async () => {
    if (!editKey) return;
    setSaving(editKey);
    let value = editValue;
    // Auto-format JSON arrays
    if (isJSON(editKey) && !editKey.includes("content")) {
      try { JSON.parse(editValue); } catch {
        // Not valid JSON, wrap as array of strings
        value = JSON.stringify(editValue.split("\n").filter(l => l.trim()));
      }
    }
    if (editKey.includes("who_content") || editKey.includes("story_content")) {
      value = JSON.stringify(editValue.split("\n").filter(l => l.trim()));
    }

    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: editKey, value }),
    });
    if (res.ok) {
      showToast("Tersimpan!");
      setEditKey(null);
      fetchData();
    } else {
      showToast("Gagal menyimpan!");
    }
    setSaving(null);
  };

  const categories = Object.keys(data);
  const currentItems = data[activeCategory] || [];

  return (
    <div className="pt-20 min-h-screen">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl text-sm font-medium">{toast}</div>
      )}

      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-emerald-900">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">CMS Editor</h1>
            <p className="text-slate-300">Klik edit pada konten yang ingin diubah</p>
          </motion.div>
        </div>
      </section>

      <section className="py-6 border-b border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setEditKey(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Memuat...</div>
          ) : (
            <div className="space-y-4">
              {currentItems.map(item => (
                <Card key={item.key} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold mb-1">{fieldNames[item.key] || item.key}</label>
                      {editKey === item.key ? (
                        <div className="space-y-3 mt-3">
                          {isLongText(item.key) || item.key.includes("who_content") || item.key.includes("story_content") ? (
                            <textarea
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              rows={6}
                              className="w-full px-4 py-3 rounded-xl border-2 border-primary-400 bg-white dark:bg-dark-800 text-sm focus:outline-none"
                            />
                          ) : isJSON(item.key) ? (
                            <textarea
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              rows={8}
                              className="w-full px-4 py-3 rounded-xl border-2 border-primary-400 bg-white dark:bg-dark-800 text-sm font-mono focus:outline-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-primary-400 bg-white dark:bg-dark-800 text-sm focus:outline-none"
                              onKeyDown={e => { if (e.key === "Enter") save(); }}
                            />
                          )}
                          <div className="flex gap-2">
                            <Button variant="primary" size="sm" onClick={save} loading={saving === item.key}>Simpan</Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditKey(null)}>Batal</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-slate-500 dark:text-slate-400 truncate flex-1">
                            {item.value.length > 80 ? item.value.slice(0, 80) + "..." : item.value}
                          </span>
                          <button
                            onClick={() => startEdit(item.key, item.value)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium whitespace-nowrap"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
