"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import { useCMS } from "@/hooks/useCMS";
import type { Country } from "@/types";

export default function CountriesPage() {
  const { data: countries, loading, error } = useFetch<Country[]>("/api/countries", []);
  const { get } = useCMS("countries");
  const [continent, setContinent] = useState<string>("all");
  const [search, setSearch] = useState("");

  const continents = ["all", ...Array.from(new Set(countries.map((c) => c.continent)))];
  const filtered = countries.filter((c) => {
    const matchContinent = continent === "all" || c.continent === continent;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.nameId.toLowerCase().includes(search.toLowerCase());
    return matchContinent && matchSearch;
  });

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-900 to-accent-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🌍</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{get("countries_title", "Countries Explorer")}</h1>
            <p className="text-xl text-slate-300">{countries.length} negara dengan cerita uniknya masing-masing</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Cari negara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex flex-wrap gap-2">
              {continents.map((c) => (
                <button
                  key={c}
                  onClick={() => setContinent(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    continent === c
                      ? "bg-primary-600 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-700"
                  }`}
                >
                  {c === "all" ? "Semua" : c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">😢</span>
              <p className="text-slate-500">Gagal memuat data.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">🔍</span>
              <p className="text-lg text-slate-500">Tidak ada negara yang cocok.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((country, i) => (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/countries/${country.slug}`}>
                    <Card className="h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">{country.flag}</span>
                        <div>
                          <h3 className="font-bold">{country.name}</h3>
                          <p className="text-xs text-slate-500">{country.continent}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{country.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          ⏱️ {country.duration}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
                          💰 Rp{(country.budget / 1000000).toFixed(1)}jt
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400">
                          🏙 {country.cities.length} kota
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-3">
                        {["overall", "safety", "food", "budget"].map((key) => (
                          <span key={key} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-dark-800">
                            {key.slice(0, 3).toUpperCase()} {country.ratings[key as keyof typeof country.ratings]}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
