"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
  displayOrder: number;
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm";

export default function DashboardTestimonialsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", avatar: "", content: "", rating: 5 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const load = () => fetch("/api/testimonials").then((r) => r.json()).then(setItems);

  useEffect(() => {
    load();
  }, []);

  if (status === "unauthenticated") return null;

  const resetForm = () => {
    setForm({ name: "", role: "", avatar: "", content: "", rating: 5 });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      alert("Nama dan isi testimoni wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/testimonials/${editId}` : "/api/testimonials";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal");
      await load();
      resetForm();
    } catch {
      alert("Gagal menyimpan testimoni");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus testimoni ini?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    await load();
  };

  const handleEdit = (item: TestimonialItem) => {
    setForm({ name: item.name, role: item.role, avatar: item.avatar || "", content: item.content, rating: item.rating });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-indigo-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Testimonials</h1>
              <p className="text-slate-300">Kelola testimoni pengunjung ({items.length})</p>
            </div>
            <Button variant="primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? "Tutup" : "+ Tambah Testimoni"}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">{editId ? "Edit Testimoni" : "Tambah Testimoni Baru"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
                    <input placeholder="Peran (contoh: Backpacker)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} />
                  </div>
                  <input placeholder="URL Avatar" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className={inputCls} />
                  <textarea placeholder="Isi testimoni..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={3} className={inputCls} />
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                    <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={`${inputCls} max-w-[120px]`} />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" loading={saving}>
                      {editId ? "Simpan" : "Tambah"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={resetForm}>Batal</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="text-5xl block mb-4">💬</span>
              <p className="text-lg text-slate-500">Belum ada testimoni.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-300 to-accent-300 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="text-yellow-500">{'★'.repeat(item.rating)}</span>
                      </div>
                      <p className="text-xs text-slate-500">{item.role}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{item.content}</p>
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
