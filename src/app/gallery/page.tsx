"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFetch } from "@/hooks/useFetch";
import type { MediaCategory } from "@/types";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  country?: string;
  city?: string;
  createdAt: string;
}

const categories: { value: MediaCategory | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "drone", label: "🚁 Drone" },
  { value: "street", label: "🏙️ Street" },
  { value: "food", label: "🍜 Food" },
  { value: "mosque", label: "🕌 Mosque" },
  { value: "people", label: "👥 People" },
  { value: "nature", label: "🌿 Nature" },
];

export default function GalleryPage() {
  const { data: items, loading } = useFetch<GalleryItem[]>("/api/gallery", []);
  const [category, setCategory] = useState<MediaCategory | "all">("all");
  const [country, setCountry] = useState<string>("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const countries = Array.from(new Set(items.map((i) => i.country).filter(Boolean))) as string[];

  const filtered = items.filter((item) => {
    const matchCategory = category === "all" || item.category === category;
    const matchCountry = country === "all" || item.country === country;
    return matchCategory && matchCountry;
  });

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🖼️</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Gallery</h1>
            <p className="text-xl text-slate-300">{items.length} foto perjalanan Ali dari seluruh dunia</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Country Filter */}
          {countries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button
                onClick={() => setCountry("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  country === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Semua Negara
              </button>
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    country === c
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">🖼️</span>
              <p className="text-lg text-slate-500">Belum ada foto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(item)}
                  className="aspect-square rounded-xl bg-gradient-to-br from-primary-100 via-accent-50 to-accent-100 dark:from-dark-700 dark:to-dark-800 cursor-pointer hover-lift overflow-hidden relative group"
                >
                  {item.src ? (
                    <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl opacity-50">📸</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">{item.country || item.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="max-w-4xl w-full rounded-2xl overflow-hidden">
              {selected.src ? (
                <img src={selected.src} alt={selected.alt} className="w-full max-h-[70vh] object-contain" />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                  <span className="text-8xl">📸</span>
                </div>
              )}
              {(selected.caption || selected.country) && (
                <div className="bg-black/50 p-4 text-center">
                  <p className="text-white">{selected.caption || selected.country}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:opacity-70"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
