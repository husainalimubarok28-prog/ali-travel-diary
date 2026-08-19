"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Country } from "@/types";

const emptyCountry = (): Country => ({
  id: "", slug: "", name: "", nameId: "", flag: "", continent: "Asia",
  description: "", heroImage: "", visited: "", duration: "", budget: 0,
  cities: [], gallery: [], video: "", coordinates: [0, 0], story: "",
  transport: [], visa: "", visaCost: 0, documents: [], tips: [],
  budgetBreakdown: [], food: [], accommodation: [], internet: "", simCard: "",
  money: "", safety: "", mosque: [], halalFood: "", bestExperience: "",
  worstExperience: "", travelTips: [], mistakes: [], hiddenGems: [],
  ratings: { overall: 4, safety: 4, food: 4, budget: 4, culture: 4 },
});

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="p-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-bold font-display">{title}</h3>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium mb-1">{children}</label>;
}

function StringList({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={3}
      value={value.join("\n")}
      onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      placeholder={placeholder || "Satu item per baris"}
      className={inputCls}
    />
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}

export default function DashboardCountriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Country[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Country>(emptyCountry());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const load = () =>
    fetch("/api/countries").then((r) => r.json()).then(setItems);

  useEffect(() => {
    load();
  }, []);

  if (status === "unauthenticated") return null;

  const resetForm = () => {
    setForm(emptyCountry());
    setEditId(null);
    setShowForm(false);
  };

  const set = <K extends keyof Country>(key: K, value: Country[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Nama negara wajib diisi");
      return;
    }
    setSaving(true);
    const payload = { ...form };
    if (!payload.slug) {
      payload.slug = form.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    }
    if (!payload.nameId) payload.nameId = form.name;
    try {
      const url = editId ? `/api/countries/${editId}` : "/api/countries";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal simpan");
      await load();
      resetForm();
    } catch (err) {
      alert("Gagal menyimpan negara");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus negara ini?")) return;
    await fetch(`/api/countries/${id}`, { method: "DELETE" });
    await load();
  };

  const handleEdit = (item: Country) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-blue-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Countries</h1>
              <p className="text-slate-300">Kelola data negara ({items.length})</p>
            </div>
            <Button variant="primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? "Tutup" : "+ Tambah Negara"}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-display">{editId ? `Edit: ${form.name}` : "Tambah Negara Baru"}</h2>
                  <Button variant="ghost" size="sm" onClick={resetForm}>Tutup</Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Section title="📋 Info Dasar">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Nama (English)" value={form.name} onChange={(v) => set("name", v)} placeholder="Egypt" />
                      <Field label="Nama (Indonesia)" value={form.nameId} onChange={(v) => set("nameId", v)} placeholder="Mesir" />
                      <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} placeholder="mesir" />
                      <Field label="Flag (Emoji)" value={form.flag} onChange={(v) => set("flag", v)} placeholder="🇪🇬" />
                      <div>
                        <Label>Benua</Label>
                        <select value={form.continent} onChange={(e) => set("continent", e.target.value)} className={inputCls}>
                          {["Asia", "Africa", "Europe", "Europe/Asia", "North America", "South America", "Oceania"].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <Field label="URL Gambar Hero" value={form.heroImage} onChange={(v) => set("heroImage", v)} placeholder="/images/countries/egypt.jpg" />
                      <Field label="Tanggal Dikunjungi" value={form.visited} onChange={(v) => set("visited", v)} placeholder="April 2025" />
                      <Field label="Durasi" value={form.duration} onChange={(v) => set("duration", v)} placeholder="14 days" />
                      <Field label="Budget (Rp)" value={form.budget} onChange={(v) => set("budget", Number(v))} type="number" />
                      <Field label="Latitude" value={form.coordinates[0] ?? 0} onChange={(v) => set("coordinates", [Number(v), form.coordinates[1] ?? 0])} type="number" step="0.0001" />
                      <Field label="Longitude" value={form.coordinates[1] ?? 0} onChange={(v) => set("coordinates", [form.coordinates[0] ?? 0, Number(v)])} type="number" step="0.0001" />
                    </div>
                    <div>
                      <Label>Deskripsi</Label>
                      <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <Label>Cerita</Label>
                      <textarea rows={4} value={form.story} onChange={(e) => set("story", e.target.value)} className={inputCls} />
                    </div>
                  </Section>

                  <Section title="🚌 Transportasi">
                    <div>
                      <Label>Transport (satu per baris)</Label>
                      <StringList value={form.transport} onChange={(v) => set("transport", v)} />
                    </div>
                  </Section>

                  <Section title="🛂 Visa & Dokumen">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Jenis Visa" value={form.visa} onChange={(v) => set("visa", v)} placeholder="Visa on Arrival $25" />
                      <Field label="Biaya Visa (Rp)" value={form.visaCost} onChange={(v) => set("visaCost", Number(v))} type="number" />
                    </div>
                    <div>
                      <Label>Dokumen (satu per baris)</Label>
                      <StringList value={form.documents} onChange={(v) => set("documents", v)} />
                    </div>
                    <div>
                      <Label>Tips Visa (satu per baris)</Label>
                      <StringList value={form.tips} onChange={(v) => set("tips", v)} />
                    </div>
                  </Section>

                  <Section title="💰 Budget Breakdown">
                    {form.budgetBreakdown.length === 0 && (
                      <p className="text-sm text-slate-400">Belum ada data.</p>
                    )}
                    <div className="space-y-2">
                      {form.budgetBreakdown.map((item, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                          <input placeholder="Kategori" value={item.category} onChange={(e) => {
                            const list = [...form.budgetBreakdown];
                            list[i] = { ...item, category: e.target.value };
                            set("budgetBreakdown", list);
                          }} className={inputCls} />
                          <input type="number" placeholder="Jumlah (Rp)" value={item.amount} onChange={(e) => {
                            const list = [...form.budgetBreakdown];
                            list[i] = { ...item, amount: Number(e.target.value) };
                            set("budgetBreakdown", list);
                          }} className={inputCls} />
                          <Button type="button" variant="ghost" size="sm" onClick={() => set("budgetBreakdown", form.budgetBreakdown.filter((_, j) => j !== i))}>🗑</Button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => set("budgetBreakdown", [...form.budgetBreakdown, { category: "", amount: 0, icon: "" }])}>+ Tambah Item</Button>
                  </Section>

                  <Section title="🍜 Makanan (Food)">
                    {form.food.length === 0 && (
                      <p className="text-sm text-slate-400">Belum ada data.</p>
                    )}
                    <div className="space-y-3">
                      {form.food.map((item, i) => (
                        <div key={i} className="border border-slate-200 dark:border-dark-700 rounded-xl p-4 space-y-3">
                          <div className="grid md:grid-cols-3 gap-3">
                            <input placeholder="Nama" value={item.name} onChange={(e) => {
                              const list = [...form.food];
                              list[i] = { ...item, name: e.target.value };
                              set("food", list);
                            }} className={inputCls} />
                            <input type="number" placeholder="Harga (Rp)" value={item.price} onChange={(e) => {
                              const list = [...form.food];
                              list[i] = { ...item, price: Number(e.target.value) };
                              set("food", list);
                            }} className={inputCls} />
                            <input type="number" step="0.1" placeholder="Rating (1-5)" value={item.rating} onChange={(e) => {
                              const list = [...form.food];
                              list[i] = { ...item, rating: Number(e.target.value) };
                              set("food", list);
                            }} className={inputCls} />
                          </div>
                          <input placeholder="Deskripsi" value={item.description} onChange={(e) => {
                            const list = [...form.food];
                            list[i] = { ...item, description: e.target.value };
                            set("food", list);
                          }} className={inputCls} />
                          <div className="flex items-center justify-between">
                            <input placeholder="URL Gambar" value={item.image} onChange={(e) => {
                              const list = [...form.food];
                              list[i] = { ...item, image: e.target.value };
                              set("food", list);
                            }} className={`${inputCls} mr-4`} />
                            <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                              <input type="checkbox" checked={item.isHalal} onChange={(e) => {
                                const list = [...form.food];
                                list[i] = { ...item, isHalal: e.target.checked };
                                set("food", list);
                              }} />
                              Halal
                            </label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => set("food", form.food.filter((_, j) => j !== i))}>🗑</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => set("food", [...form.food, { name: "", price: 0, rating: 4, description: "", image: "", isHalal: true }])}>+ Tambah Makanan</Button>
                  </Section>

                  <Section title="🏨 Akomodasi">
                    <div>
                      <Label>Akomodasi (satu per baris)</Label>
                      <StringList value={form.accommodation} onChange={(v) => set("accommodation", v)} />
                    </div>
                  </Section>

                  <Section title="📶 Internet, SIM, Uang, Keamanan">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Internet" value={form.internet} onChange={(v) => set("internet", v)} />
                      <Field label="SIM Card" value={form.simCard} onChange={(v) => set("simCard", v)} />
                      <Field label="Mata Uang / Pembayaran" value={form.money} onChange={(v) => set("money", v)} />
                      <Field label="Keamanan" value={form.safety} onChange={(v) => set("safety", v)} />
                    </div>
                  </Section>

                  <Section title="🕌 Masjid & Makanan Halal">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Masjid (satu per baris)</Label>
                        <StringList value={form.mosque} onChange={(v) => set("mosque", v)} />
                      </div>
                      <Field label="Ketersediaan Makanan Halal" value={form.halalFood} onChange={(v) => set("halalFood", v)} />
                    </div>
                  </Section>

                  <Section title="🌟 Pengalaman">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Pengalaman Terbaik" value={form.bestExperience} onChange={(v) => set("bestExperience", v)} />
                      <Field label="Pengalaman Terburuk" value={form.worstExperience} onChange={(v) => set("worstExperience", v)} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Travel Tips (satu per baris)</Label>
                        <StringList value={form.travelTips} onChange={(v) => set("travelTips", v)} />
                      </div>
                      <div>
                        <Label>Mistakes (satu per baris)</Label>
                        <StringList value={form.mistakes} onChange={(v) => set("mistakes", v)} />
                      </div>
                      <div>
                        <Label>Hidden Gems (satu per baris)</Label>
                        <StringList value={form.hiddenGems} onChange={(v) => set("hiddenGems", v)} />
                      </div>
                    </div>
                  </Section>

                  <Section title="⭐ Rating">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {(["overall", "safety", "food", "budget", "culture"] as const).map((key) => (
                        <Field
                          key={key}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          value={form.ratings[key]}
                          onChange={(v) => set("ratings", { ...form.ratings, [key]: Number(v) })}
                          type="number"
                          step="0.1"
                        />
                      ))}
                    </div>
                  </Section>

                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" loading={saving}>
                      {editId ? "Simpan Perubahan" : "Tambah Negara"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={resetForm}>Batal</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          <div className="space-y-4">
            {items.length === 0 && (
              <Card className="p-12 text-center">
                <span className="text-5xl block mb-4">🌍</span>
                <p className="text-lg text-slate-500">Belum ada negara.</p>
              </Card>
            )}
            {items.map((country, i) => (
              <motion.div key={country.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="p-4 flex items-center gap-4">
                  <span className="text-3xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{country.name} <span className="text-slate-400 font-normal">({country.nameId})</span></h3>
                    <p className="text-xs text-slate-500">{country.continent} • {country.cities.length} kota • Rp {(country.budget / 1000000).toFixed(1)}jt</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(country)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(country.id)}>Hapus</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
