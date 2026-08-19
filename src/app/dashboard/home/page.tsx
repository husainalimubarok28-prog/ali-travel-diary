"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TravelStatistic } from "@/types";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm";

type SettingsState = {
  hero: { title: string; subtitle: string; cta: string; cta2: string };
  travelStatistics: TravelStatistic[];
  featuredStory: { title: string; excerpt: string; image: string; slug: string; buttonLabel: string };
  partners: string[];
  galleryPreview: string[];
  newsletter: { title: string; subtitle: string; placeholder: string; cta: string };
};

const defaultSettings: SettingsState = {
  hero: { title: "", subtitle: "", cta: "", cta2: "" },
  travelStatistics: [],
  featuredStory: { title: "", excerpt: "", image: "", slug: "", buttonLabel: "" },
  partners: [],
  galleryPreview: [],
  newsletter: { title: "", subtitle: "", placeholder: "", cta: "" },
};

type TabKey = keyof SettingsState;

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "hero", label: "Hero", icon: "🎯" },
  { key: "travelStatistics", label: "Statistik", icon: "📊" },
  { key: "featuredStory", label: "Featured Story", icon: "📖" },
  { key: "partners", label: "Partner", icon: "🤝" },
  { key: "galleryPreview", label: "Preview Gallery", icon: "🖼️" },
  { key: "newsletter", label: "Newsletter", icon: "📬" },
];

export default function DashboardHomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [tab, setTab] = useState<TabKey>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          hero: { ...defaultSettings.hero, ...(data.hero || {}) },
          travelStatistics: data.travelStatistics || [],
          featuredStory: { ...defaultSettings.featuredStory, ...(data.featuredStory || {}) },
          partners: data.partners || [],
          galleryPreview: data.galleryPreview || [],
          newsletter: { ...defaultSettings.newsletter, ...(data.newsletter || {}) },
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (status === "unauthenticated") return null;

  const saveSection = async (key: TabKey) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/settings/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings[key]),
      });
      if (!res.ok) throw new Error("Gagal");
      alert("Berhasil disimpan");
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
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
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-emerald-900">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white font-display">Konten Halaman Utama</h1>
          <p className="text-slate-300">Edit teks dan data yang tampil di halaman utama</p>
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
            {tab === "hero" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">🎯 Hero Section</h2>
                <input placeholder="Judul" value={settings.hero.title} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })} className={inputCls} />
                <input placeholder="Subtitle" value={settings.hero.subtitle} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })} className={inputCls} />
                <input placeholder="Tombol CTA 1" value={settings.hero.cta} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, cta: e.target.value } })} className={inputCls} />
                <input placeholder="Tombol CTA 2" value={settings.hero.cta2} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, cta2: e.target.value } })} className={inputCls} />
              </div>
            )}

            {tab === "travelStatistics" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">📊 Statistik Perjalanan</h2>
                <div className="space-y-3">
                  {settings.travelStatistics.map((stat, i) => (
                    <div key={i} className="border border-slate-200 dark:border-dark-700 rounded-xl p-4 space-y-3">
                      <div className="grid md:grid-cols-3 gap-3">
                        <input placeholder="Label" value={stat.label} onChange={(e) => {
                          const list = [...settings.travelStatistics];
                          list[i] = { ...stat, label: e.target.value };
                          setSettings({ ...settings, travelStatistics: list });
                        }} className={inputCls} />
                        <input placeholder="Nilai (contoh: 21 atau 500+)" value={stat.value} onChange={(e) => {
                          const list = [...settings.travelStatistics];
                          list[i] = { ...stat, value: e.target.value };
                          setSettings({ ...settings, travelStatistics: list });
                        }} className={inputCls} />
                        <input placeholder="Ikon (emoji)" value={stat.icon} onChange={(e) => {
                          const list = [...settings.travelStatistics];
                          list[i] = { ...stat, icon: e.target.value };
                          setSettings({ ...settings, travelStatistics: list });
                        }} className={inputCls} />
                      </div>
                      <div className="flex items-center gap-3">
                        <input placeholder="Deskripsi" value={stat.description} onChange={(e) => {
                          const list = [...settings.travelStatistics];
                          list[i] = { ...stat, description: e.target.value };
                          setSettings({ ...settings, travelStatistics: list });
                        }} className={`${inputCls} flex-1`} />
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSettings({ ...settings, travelStatistics: settings.travelStatistics.filter((_, j) => j !== i) })}>🗑</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setSettings({ ...settings, travelStatistics: [...settings.travelStatistics, { label: "", value: "", icon: "🌍", description: "" }] })}>+ Tambah Statistik</Button>
              </div>
            )}

            {tab === "featuredStory" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">📖 Featured Story</h2>
                <input placeholder="Judul" value={settings.featuredStory.title} onChange={(e) => setSettings({ ...settings, featuredStory: { ...settings.featuredStory, title: e.target.value } })} className={inputCls} />
                <textarea placeholder="Cuplikan / excerpt" rows={4} value={settings.featuredStory.excerpt} onChange={(e) => setSettings({ ...settings, featuredStory: { ...settings.featuredStory, excerpt: e.target.value } })} className={inputCls} />
                <input placeholder="URL Gambar" value={settings.featuredStory.image} onChange={(e) => setSettings({ ...settings, featuredStory: { ...settings.featuredStory, image: e.target.value } })} className={inputCls} />
                <input placeholder="Slug artikel tujuan" value={settings.featuredStory.slug} onChange={(e) => setSettings({ ...settings, featuredStory: { ...settings.featuredStory, slug: e.target.value } })} className={inputCls} />
                <input placeholder="Label tombol" value={settings.featuredStory.buttonLabel} onChange={(e) => setSettings({ ...settings, featuredStory: { ...settings.featuredStory, buttonLabel: e.target.value } })} className={inputCls} />
              </div>
            )}

            {tab === "partners" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">🤝 Logo Partner & Sponsor</h2>
                <textarea
                  rows={5}
                  value={settings.partners.join("\n")}
                  onChange={(e) => setSettings({ ...settings, partners: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  placeholder="Satu nama per baris"
                  className={inputCls}
                />
                <p className="text-xs text-slate-400">Simpan dan masukkan nama partner yang diinginkan.</p>
              </div>
            )}

            {tab === "galleryPreview" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">🖼️ Preview Galeri di Halaman Utama</h2>
                <textarea
                  rows={5}
                  value={settings.galleryPreview.join("\n")}
                  onChange={(e) => setSettings({ ...settings, galleryPreview: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  placeholder="Satu nama per baris (contoh: Egypt)"
                  className={inputCls}
                />
              </div>
            )}

            {tab === "newsletter" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display mb-4">📬 Newsletter</h2>
                <input placeholder="Judul" value={settings.newsletter.title} onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, title: e.target.value } })} className={inputCls} />
                <input placeholder="Subtitle" value={settings.newsletter.subtitle} onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, subtitle: e.target.value } })} className={inputCls} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Placeholder" value={settings.newsletter.placeholder} onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, placeholder: e.target.value } })} className={inputCls} />
                  <input placeholder="Label Tombol" value={settings.newsletter.cta} onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, cta: e.target.value } })} className={inputCls} />
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-dark-700 flex justify-end">
              <Button variant="primary" onClick={() => saveSection(tab)} loading={saving}>
                💾 Simpan {tabs.find((t) => t.key === tab)?.label}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
