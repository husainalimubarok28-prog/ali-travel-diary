"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { countries } from "@/data/countries";
import type { Country } from "@/types";

function CountryPopup({ country, onClose }: { country: Country; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="glass-card p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{country.flag}</span>
          <div>
            <h3 className="text-xl font-bold">{country.name}</h3>
            <p className="text-sm text-slate-500">{country.continent}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg">&times;</button>
      </div>

      <div className="space-y-4">
        <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
          <span className="text-4xl">📸</span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">{country.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="glass rounded-lg p-2 text-center">
            <span className="block text-lg">📅</span>
            <span className="text-xs text-slate-500">{country.visited}</span>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <span className="block text-lg">⏱️</span>
            <span className="text-xs text-slate-500">{country.duration}</span>
          </div>
          <div className="glass rounded-lg p-2 text-center col-span-2">
            <span className="block text-lg">💰</span>
            <span className="text-xs text-slate-500">Budget: Rp {(country.budget / 1000000).toFixed(1)} Juta</span>
          </div>
        </div>

        {country.food.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">🍜 Makanan</h4>
            <div className="space-y-2">
              {country.food.map((food, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-dark-800 rounded-lg p-2">
                  <span>{food.name}</span>
                  <span className="text-primary-600 font-semibold">Rp {food.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {country.budgetBreakdown.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">💰 Budget</h4>
            <div className="space-y-2">
              {country.budgetBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-dark-800 rounded-lg p-2">
                  <span>{item.category}</span>
                  <span className="font-semibold">Rp {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/countries/${country.slug}`} className="flex-1">
            <Button variant="primary" className="w-full">Lihat Detail</Button>
          </Link>
          <Link href={`/budget/${country.slug}`}>
            <Button variant="outline">💰 Budget</Button>
          </Link>
        </div>

        {country.travelTips.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">💡 Tips</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
              {country.travelTips.slice(0, 3).map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function WorldMapPage() {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const continents = ["all", ...Array.from(new Set(countries.map((c) => c.continent)))];
  const filteredCountries = filter === "all" ? countries : countries.filter((c) => c.continent === filter);

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🗺️</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
              {t("map.title")}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">{t("map.desc")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* Map Visualization */}
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-800 dark:to-dark-900 mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <span className="text-8xl block mb-4">🌍</span>
                <p className="text-lg font-medium">Interactive World Map</p>
                <p className="text-sm">(Mapbox/Leaflet integration coming soon)</p>
              </div>
            </div>
            {/* Route animation placeholder */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600">
              <path
                d="M200,300 L300,280 L400,320 L500,290 L600,310 L700,280 L800,300 L900,270 L1000,290"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3"
                strokeDasharray="10 10"
                className="animate-dash"
              />
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === c
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-700"
                }`}
              >
                {c === "all" ? "Semua" : c}
              </button>
            ))}
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredCountries.map((country, index) => (
              <motion.button
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCountry(country)}
                className="glass-card p-4 text-center hover-lift group"
              >
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{country.flag}</span>
                <h3 className="font-semibold text-sm">{country.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{country.continent}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedCountry(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <CountryPopup country={selectedCountry} onClose={() => setSelectedCountry(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
