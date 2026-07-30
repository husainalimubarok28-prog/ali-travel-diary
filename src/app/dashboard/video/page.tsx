"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface VideoItem {
  id: string; title: string; url: string; platform: string;
  thumbnail?: string; country: string; duration?: string; views: number;
}

export default function DashboardVideoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<VideoItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", url: "", platform: "youtube", country: "", duration: "", views: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/video").then(r => r.json()).then(setItems);
  }, []);

  if (status === "unauthenticated") return null;

  const resetForm = () => {
    setForm({ title: "", url: "", platform: "youtube", country: "", duration: "", views: 0 });
    setEditId(null); setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/video/${editId}` : "/api/video";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const updated = await fetch("/api/video").then(r => r.json());
    setItems(updated);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus video ini?")) return;
    await fetch(`/api/video/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  };

  const handleEdit = (item: VideoItem) => {
    setForm({ title: item.title, url: item.url, platform: item.platform, country: item.country, duration: item.duration || "", views: item.views });
    setEditId(item.id); setShowForm(true);
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-red-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Video</h1>
              <p className="text-slate-300">{items.length} video</p>
            </div>
            <Button variant="primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? "Tutup" : "+ Tambah Video"}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">{editId ? "Edit Video" : "Tambah Video Baru"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input placeholder="Judul Video" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                  <input placeholder="URL (YouTube / TikTok / Instagram)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800">
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                    </select>
                    <input placeholder="Negara" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Durasi (contoh: 10:30)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                    <input type="number" placeholder="Views" value={form.views} onChange={e => setForm({ ...form, views: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="primary">{editId ? "Simpan" : "Tambah"}</Button>
                    <Button type="button" variant="secondary" onClick={resetForm}>Batal</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="text-5xl block mb-4">🎬</span>
              <p className="text-lg text-slate-500">Belum ada video. Klik "+ Tambah Video" untuk mulai.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 flex items-center justify-center text-sm flex-shrink-0">
                      {item.platform === "youtube" ? "▶️" : item.platform === "tiktok" ? "🎵" : "📸"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <p className="text-xs text-slate-500">{item.country} • {item.duration || "-"} • {item.views?.toLocaleString()} views</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Hapus</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
