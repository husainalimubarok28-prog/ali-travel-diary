"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const countryList = [
  "Indonesia", "Malaysia", "Thailand", "Vietnam", "Singapore",
  "Egypt", "Turkey", "Morocco", "Nepal", "India",
  "Germany", "France", "Netherlands", "Belgium", "Switzerland",
  "Italy", "Spain", "Portugal", "Japan", "South Korea", "China"
];

interface CityItem {
  id: string; name: string; slug: string; countryName: string; countrySlug: string;
  description: string; budget: number; duration?: string; highlights?: string;
}

export default function DashboardCitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CityItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", countryName: "", description: "", budget: 0, duration: "", highlights: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/cities").then(r => r.json()).then(setItems);
  }, []);

  if (status === "unauthenticated") return null;

  const resetForm = () => {
    setForm({ name: "", countryName: "", description: "", budget: 0, duration: "", highlights: "" });
    setEditId(null); setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/cities/${editId}` : "/api/cities";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const updated = await fetch("/api/cities").then(r => r.json());
    setItems(updated);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kota ini?")) return;
    await fetch(`/api/cities/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  };

  const handleEdit = (item: CityItem) => {
    setForm({
      name: item.name, countryName: item.countryName, description: item.description,
      budget: item.budget, duration: item.duration || "", highlights: item.highlights || ""
    });
    setEditId(item.id); setShowForm(true);
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-green-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Cities</h1>
              <p className="text-slate-300">{items.length} kota</p>
            </div>
            <Button variant="primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? "Tutup" : "+ Tambah Kota"}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">{editId ? "Edit Kota" : "Tambah Kota Baru"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Nama Kota" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                    <select value={form.countryName} onChange={e => setForm({ ...form, countryName: e.target.value })} required className="px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800">
                      <option value="">Pilih Negara</option>
                      {countryList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <textarea placeholder="Deskripsi kota" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" rows={3} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Budget (Rp)" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                    <input placeholder="Durasi (contoh: 4 hari)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                  </div>
                  <input placeholder="Highlights (pisahkan dengan koma)" value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
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
              <span className="text-5xl block mb-4">🏙️</span>
              <p className="text-lg text-slate-500">Belum ada kota. Klik "+ Tambah Kota" untuk mulai.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-dark-700 flex items-center justify-center text-xl flex-shrink-0">🏙️</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.countryName} • Rp{item.budget.toLocaleString()} • {item.duration || "-"}</p>
                      <p className="text-xs text-slate-400 truncate">{item.description}</p>
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
