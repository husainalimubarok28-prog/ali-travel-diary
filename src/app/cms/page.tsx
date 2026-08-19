"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ContentItem = { key: string; value: string; category: string; updatedAt: string };

const categoryLabels: Record<string, string> = {
  home: "🏠 Halaman Depan",
  about: "👤 Tentang Ali",
  stats: "📊 Statistik",
  general: "⚙️ Umum",
};

const fieldLabels: Record<string, string> = {
  hero_title: "Judul Hero",
  hero_subtitle: "Subtitle Hero",
  hero_cta: "Tombol CTA 1",
  hero_cta2: "Tombol CTA 2",
  featured_title: "Judul Featured",
  featured_heading: "Heading Featured",
  featured_text: "Teks Featured",
  about_who_title: "Judul Siapa Ali",
  about_who_content: "Konten Siapa Ali (JSON array paragraf)",
  about_story_title: "Judul Awal Mula",
  about_story_content: "Konten Awal Mula (JSON array paragraf)",
  about_milestones_title: "Judul Perjalanan",
  stats: "Statistik (JSON array)",
  site_name: "Nama Website",
  site_tagline: "Tagline Website",
  footer_tagline: "Tagline Footer",
};

const fieldDescriptions: Record<string, string> = {
  about_who_content: "Tiap paragraf dipisahkan dengan koma dalam array JSON. Contoh: [\"Paragraf 1\", \"Paragraf 2\"]",
  about_story_content: "Sama formatnya: [\"Paragraf 1\", \"Paragraf 2\", \"Paragraf 3\"]",
  stats: 'Format: [{"label":"Nama","value":"Angka","icon":"🌍"}]',
};

export default function CMSPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<Record<string, ContentItem[]>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<{ key: string; text: string }[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms");
      const data = await res.json();
      setContent(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  if (status === "unauthenticated") return null;

  const startEdit = (item: ContentItem) => {
    try {
      const parsed = JSON.parse(item.value);
      setEditValue(Array.isArray(parsed) ? parsed.join("\n") : JSON.stringify(parsed, null, 2));
    } catch {
      setEditValue(item.value);
    }
    setEditing(item.key);
  };

  const saveContent = async () => {
    if (!editing) return;
    setSaving(true);
    let value = editValue;
    // Try to detect if it should be JSON
    if (["about_who_content", "about_story_content"].includes(editing)) {
      value = JSON.stringify(editValue.split("\n").filter(l => l.trim()));
    }
    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: editing, value }),
    });
    if (res.ok) {
      setMessages(prev => [...prev, { key: Date.now().toString(), text: `✅ ${fieldLabels[editing] || editing} tersimpan!` }]);
      setTimeout(() => setMessages(prev => prev.filter(m => m.key !== Date.now().toString())), 3000);
      setEditing(null);
      fetchContent();
    } else {
      alert("Gagal menyimpan!");
    }
    setSaving(false);
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-emerald-900" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">CMS Editor</h1>
            <p className="text-xl text-slate-300">Edit semua konten website langsung dari sini</p>
          </motion.div>
        </div>
      </section>

      {/* Toast messages */}
      {messages.length > 0 && (
        <div className="fixed top-24 right-4 z-50 space-y-2">
          {messages.map(m => (
            <div key={m.key} className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm">{m.text}</div>
          ))}
        </div>
      )}

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Memuat konten...</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(content).map(([category, items]) => (
                <Card key={category} className="p-6">
                  <h2 className="text-xl font-bold mb-6 font-display">{categoryLabels[category] || category}</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.key} className="border-b border-slate-100 dark:border-dark-700 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <label className="block text-sm font-semibold mb-1">{fieldLabels[item.key] || item.key}</label>
                            {fieldDescriptions[item.key] && (
                              <p className="text-xs text-slate-400 mb-2">{fieldDescriptions[item.key]}</p>
                            )}
                            {editing === item.key ? (
                              <div className="space-y-2">
                                {["about_who_content", "about_story_content"].includes(item.key) ? (
                                  <textarea
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-primary-400 bg-white dark:bg-dark-800 text-sm font-mono"
                                    placeholder="Tulis tiap paragraf di baris baru"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-primary-400 bg-white dark:bg-dark-800 text-sm"
                                  />
                                )}
                                <div className="flex gap-2">
                                  <Button variant="primary" size="sm" onClick={saveContent} loading={saving}>Simpan</Button>
                                  <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Batal</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <pre className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                  {(() => {
                                    try {
                                      if (item.key === "stats") return `📊 ${JSON.parse(item.value).length} item statistik`;
                                      if (item.key.includes("content")) return `📝 ${JSON.parse(item.value).length} paragraf`;
                                    } catch {}
                                    return item.value.length > 80 ? item.value.slice(0, 80) + "..." : item.value;
                                  })()}
                                </pre>
                                <button onClick={() => startEdit(item)} className="text-xs text-primary-600 hover:underline whitespace-nowrap flex-shrink-0">
                                  ✏️ Edit
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <a href="/dashboard/settings" className="glass-card p-4 text-center hover-lift">
              <span className="text-2xl block mb-1">🖼️</span>
              <span className="text-sm font-medium">Ganti Foto Profil</span>
            </a>
            <a href="/dashboard/blog" className="glass-card p-4 text-center hover-lift">
              <span className="text-2xl block mb-1">📝</span>
              <span className="text-sm font-medium">Kelola Blog</span>
            </a>
            <a href="/dashboard/cities" className="glass-card p-4 text-center hover-lift">
              <span className="text-2xl block mb-1">🏙️</span>
              <span className="text-sm font-medium">Kelola Kota</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
