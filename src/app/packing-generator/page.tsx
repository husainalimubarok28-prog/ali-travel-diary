"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import { useCMS } from "@/hooks/useCMS";
import type { Country } from "@/types";

export default function PackingGeneratorPage() {
  const { data: countries, loading } = useFetch<Country[]>("/api/countries", []);
  const { get } = useCMS("packing");
  const [country, setCountry] = useState("");
  const [season, setSeason] = useState("tropical");
  const [duration, setDuration] = useState(7);
  const [generated, setGenerated] = useState(false);

  const generatePackingList = () => {
    setGenerated(true);
  };

  const essentials = [
    { category: "Dokumen", items: ["Paspor", "Visa", "Tiket", "Asuransi Travel", "Foto Copy Dokumen"] },
    { category: "Pakaian", items: [
      ...(duration > 5 ? ["Baju 5-7 set", "Celana 3-4"] : ["Baju 3-4 set", "Celana 2"]),
      "Jaket", "Sepatu Nyaman", "Sandal", "Kaus Kaki",
      ...(season === "cold" ? ["Jas Hujan", "Sarung Tangan", "Topi Wol", "Syall"] : ["Topi", "Kacamata Hitam"]),
    ]},
    { category: "Elektronik", items: ["Powerbank", "Adaptor Universal", "Kabel USB", "Kamera", "Tripod"] },
    { category: "Kesehatan", items: ["P3K", "Obat Pribadi", "Masker", "Hand Sanitizer", "Sunscreen"] },
    { category: "Lainnya", items: ["Travel Towel", "Kunci Gembok", "Earplug", "Sleep Mask", "Pillow Travel"] },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-orange-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🎒</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{get("packing_title", "Packing List Generator")}</h1>
            <p className="text-xl text-slate-300">{get("packing_subtitle", "Dapatkan packing list customized untuk perjalananmu")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Negara Tujuan</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- Pilih --</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.slug}>{c.flag} {c.name}</option>
                  ))}
                  {!loading && countries.length === 0 && <option value="">Belum ada negara</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Musim</label>
                <div className="flex gap-2">
                  {[
                    { value: "tropical", label: "🌴 Tropis" },
                    { value: "summer", label: "☀️ Summer" },
                    { value: "cold", label: "❄️ Dingin" },
                    { value: "rainy", label: "🌧️ Hujan" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSeason(s.value)}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        season === s.value
                          ? "bg-primary-600 text-white shadow-lg"
                          : "bg-slate-100 dark:bg-dark-800 text-slate-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Durasi: {duration} hari</label>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-primary-600"
                />
              </div>

              <Button onClick={generatePackingList} variant="primary" size="lg" className="w-full">
                Generate Packing List
              </Button>
            </div>
          </Card>

          {generated && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {essentials.map((section) => (
                <div key={section.category} className="mb-6">
                  <h3 className="text-lg font-bold mb-3 font-display">{section.category}</h3>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <label key={i} className="flex items-center gap-3 glass-card px-4 py-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-primary-600" />
                        <span className="text-sm font-medium">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-center mt-8">
                <Button variant="outline">📥 Download PDF</Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
