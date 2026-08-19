"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TimelineEvent, VisaInfo, PackingItem } from "@/types";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm";

type FAQItem = { question: string; answer: string };

type SettingsData = {
  timelineEvents: TimelineEvent[];
  visaInfo: VisaInfo[];
  packingItems: PackingItem[];
  faqImmersion: FAQItem[];
};

const defaults: SettingsData = {
  timelineEvents: [],
  visaInfo: [],
  packingItems: [],
  faqImmersion: [],
};

type ActiveTab = "profile" | keyof SettingsData;

const tabs: { key: ActiveTab; label: string; icon: string }[] = [
  { key: "profile", label: "Profil & Avatar", icon: "👤" },
  { key: "timelineEvents", label: "Timeline", icon: "📅" },
  { key: "visaInfo", label: "Pusat Visa", icon: "🛂" },
  { key: "packingItems", label: "Checklist", icon: "🎒" },
  { key: "faqImmersion", label: "FAQ Immersion", icon: "🎓" },
];

export default function DashboardSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState<SettingsData>(defaults);
  const [tab, setTab] = useState<ActiveTab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then(r => r.json()).then(p => {
        if (p?.name) setName(p.name);
        if (p?.avatar) setAvatar(p.avatar);
      }).catch(() => {}),
      fetch("/api/settings").then(r => r.json()).then(res => {
        setData({
          timelineEvents: res.timelineEvents || [],
          visaInfo: res.visaInfo || [],
          packingItems: res.packingItems || [],
          faqImmersion: res.faqImmersion || [],
        });
      }).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  if (status === "unauthenticated") return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      setAvatar(url);
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar: url }),
      });
      alert("Foto profil berhasil diupload & disimpan!");
    } catch {
      alert("Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar }),
      });
      if (!res.ok) throw new Error("Gagal");
      alert("Profil tersimpan!");
    } catch {
      alert("Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    if (tab === "profile") return saveProfile();
    setSaving(true);
    try {
      const res = await fetch(`/api/settings/${tab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data[tab]),
      });
      if (!res.ok) throw new Error("Gagal");
      alert("Berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const setList = <K extends keyof SettingsData>(key: K, list: SettingsData[K]) => {
    setData((d) => ({ ...d, [key]: list }));
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-slate-900">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white font-display">Konten & Pengaturan</h1>
          <p className="text-slate-300">Kelola profil, foto avatar, timeline, visa, checklist, dan FAQ</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <Card className="p-6">
            {tab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold font-display mb-4">👤 Foto Profil & Identitas</h2>
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-dark-700">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-300 to-accent-300 flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                    {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
                  </div>
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    <Button variant="primary" onClick={() => fileRef.current?.click()} loading={uploading}>
                      {avatar ? "Ganti Foto Profil" : "Upload Foto Profil"}
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">Foto otomatis tampil di halaman About & Hero Landing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email (Akun)</label>
                    <input type="email" value={session?.user?.email || ""} disabled className={`${inputCls} opacity-60`} />
                  </div>
                </div>
              </div>
            )}

            {tab === "timelineEvents" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">📅 Timeline Perjalanan</h2>
                {data.timelineEvents.map((ev, i) => (
                  <div key={i} className="border border-slate-200 dark:border-dark-700 rounded-xl p-4 space-y-3">
                    <div className="grid md:grid-cols-4 gap-3">
                      <input placeholder="Bulan/Tahun" value={ev.year} onChange={(e) => { const l = [...data.timelineEvents]; l[i] = { ...ev, year: e.target.value }; setList("timelineEvents", l); }} className={inputCls} />
                      <input placeholder="Negara" value={ev.country} onChange={(e) => { const l = [...data.timelineEvents]; l[i] = { ...ev, country: e.target.value }; setList("timelineEvents", l); }} className={inputCls} />
                      <input placeholder="Ikon (emoji)" value={ev.icon} onChange={(e) => { const l = [...data.timelineEvents]; l[i] = { ...ev, icon: e.target.value }; setList("timelineEvents", l); }} className={inputCls} />
                      <Button type="button" variant="ghost" size="sm" onClick={() => setList("timelineEvents", data.timelineEvents.filter((_, j) => j !== i))}>🗑</Button>
                    </div>
                    <input placeholder="Judul" value={ev.title} onChange={(e) => { const l = [...data.timelineEvents]; l[i] = { ...ev, title: e.target.value }; setList("timelineEvents", l); }} className={inputCls} />
                    <textarea placeholder="Deskripsi" rows={2} value={ev.description} onChange={(e) => { const l = [...data.timelineEvents]; l[i] = { ...ev, description: e.target.value }; setList("timelineEvents", l); }} className={inputCls} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setList("timelineEvents", [...data.timelineEvents, { year: "", title: "", description: "", icon: "🌍", country: "" }])}>+ Tambah Event</Button>
              </div>
            )}

            {tab === "visaInfo" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">🛂 Info Visa</h2>
                {data.visaInfo.map((v, i) => (
                  <div key={i} className="border border-slate-200 dark:border-dark-700 rounded-xl p-4 space-y-3">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input placeholder="Negara" value={v.country} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, country: e.target.value }; setList("visaInfo", l); }} className={inputCls} />
                      <input placeholder="Bendera" value={v.flag} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, flag: e.target.value }; setList("visaInfo", l); }} className={inputCls} />
                      <input placeholder="Jenis Visa" value={v.visaType} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, visaType: e.target.value }; setList("visaInfo", l); }} className={inputCls} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <input type="number" placeholder="Biaya (Rp)" value={v.cost} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, cost: Number(e.target.value) }; setList("visaInfo", l); }} className={inputCls} />
                      <input placeholder="Durasi (30 hari)" value={v.duration} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, duration: e.target.value }; setList("visaInfo", l); }} className={inputCls} />
                      <input placeholder="Proses (24 jam)" value={v.processingTime} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, processingTime: e.target.value }; setList("visaInfo", l); }} className={inputCls} />
                    </div>
                    <input placeholder="Link resmi" value={v.link} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, link: e.target.value }; setList("visaInfo", l); }} className={inputCls} />
                    <div className="grid md:grid-cols-3 gap-3">
                      <textarea placeholder="Dokumen (pisahkan dengan koma)" rows={2} value={v.documents.join(", ")} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, documents: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }; setList("visaInfo", l); }} className={inputCls} />
                      <textarea placeholder="Syarat (pisahkan dengan koma)" rows={2} value={v.requirements.join(", ")} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, requirements: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }; setList("visaInfo", l); }} className={inputCls} />
                      <textarea placeholder="Tips (pisahkan dengan koma)" rows={2} value={v.tips.join(", ")} onChange={(e) => { const l = [...data.visaInfo]; l[i] = { ...v, tips: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }; setList("visaInfo", l); }} className={inputCls} />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setList("visaInfo", data.visaInfo.filter((_, j) => j !== i))}>🗑 Hapus</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setList("visaInfo", [...data.visaInfo, { country: "", flag: "", visaType: "", cost: 0, duration: "", documents: [], requirements: [], link: "", tips: [], processingTime: "" }])}>+ Tambah Info Visa</Button>
              </div>
            )}

            {tab === "packingItems" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">🎒 Checklist Packing</h2>
                {data.packingItems.map((p, i) => (
                  <div key={i} className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center border border-slate-200 dark:border-dark-700 rounded-xl p-4">
                    <input placeholder="Nama item" value={p.name} onChange={(e) => { const l = [...data.packingItems]; l[i] = { ...p, name: e.target.value }; setList("packingItems", l); }} className={inputCls} />
                    <input placeholder="Kategori" value={p.category} onChange={(e) => { const l = [...data.packingItems]; l[i] = { ...p, category: e.target.value }; setList("packingItems", l); }} className={inputCls} />
                    <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <input type="checkbox" checked={p.essential} onChange={(e) => { const l = [...data.packingItems]; l[i] = { ...p, essential: e.target.checked }; setList("packingItems", l); }} />
                      Esensial
                    </label>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setList("packingItems", data.packingItems.filter((_, j) => j !== i))}>🗑</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setList("packingItems", [...data.packingItems, { id: "", category: "", name: "", essential: true }])}>+ Tambah Item</Button>
              </div>
            )}

            {tab === "faqImmersion" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">🎓 FAQ Student Immersion</h2>
                {data.faqImmersion.map((f, i) => (
                  <div key={i} className="border border-slate-200 dark:border-dark-700 rounded-xl p-4 space-y-3">
                    <div className="flex gap-3">
                      <input placeholder="Pertanyaan" value={f.question} onChange={(e) => { const l = [...data.faqImmersion]; l[i] = { ...f, question: e.target.value }; setList("faqImmersion", l); }} className={inputCls} />
                      <Button type="button" variant="ghost" size="sm" onClick={() => setList("faqImmersion", data.faqImmersion.filter((_, j) => j !== i))}>🗑</Button>
                    </div>
                    <textarea placeholder="Jawaban" rows={3} value={f.answer} onChange={(e) => { const l = [...data.faqImmersion]; l[i] = { ...f, answer: e.target.value }; setList("faqImmersion", l); }} className={inputCls} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setList("faqImmersion", [...data.faqImmersion, { question: "", answer: "" }])}>+ Tambah FAQ</Button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-dark-700 flex justify-end">
              <Button variant="primary" onClick={saveSettings} loading={saving}>💾 Simpan {tabs.find((t) => t.key === tab)?.label}</Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
