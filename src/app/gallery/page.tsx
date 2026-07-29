"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { countries } from "@/data/countries";
import type { MediaCategory } from "@/types";

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
  const [category, setCategory] = useState<MediaCategory | "all">("all");
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🖼️</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Gallery</h1>
            <p className="text-xl text-slate-300">Foto-foto perjalanan Ali dari 21 negara</p>
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
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {countries.slice(0, 10).map((c) => (
              <button key={c.id} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">
                {c.flag} {c.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(i)}
                className="aspect-square rounded-xl bg-gradient-to-br from-primary-100 via-accent-50 to-accent-100 dark:from-dark-700 dark:to-dark-800 cursor-pointer hover-lift overflow-hidden relative group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-50 group-hover:scale-125 transition-transform">
                    {["📸", "🕌", "🍜", "🌿", "🏙️", "👥"][i % 6]}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">{countries[i % countries.length].name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="max-w-4xl w-full aspect-video rounded-2xl bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
              <span className="text-8xl">📸</span>
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
