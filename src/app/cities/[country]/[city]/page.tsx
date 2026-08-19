"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import type { City } from "@/types";

export default function CityPage() {
  const { country, city } = useParams<{ country: string; city: string }>();
  const { data: cityData, loading } = useFetch<City | null>(`/api/cities/${city}`, null);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!cityData || cityData.countrySlug !== country) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">Kota tidak ditemukan</h1>
          <Link href="/countries"><Button variant="primary">Kembali</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-accent-900" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-display">{cityData.name}</h1>
            <p className="text-xl text-slate-300 mb-2">{cityData.countryName}</p>
            <p className="text-lg text-slate-400 max-w-2xl">{cityData.description}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="glass px-4 py-2 rounded-xl text-white/80 text-sm">💰 Rp{(cityData.budget / 1000000).toFixed(1)} Juta</span>
              <span className="glass px-4 py-2 rounded-xl text-white/80 text-sm">⏱️ {cityData.duration}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom section-padding space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">Highlights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {cityData.highlights.map((h, i) => (
              <Card key={i} className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <span className="font-medium">{h}</span>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">Galeri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap gap-4 justify-center">
          <Link href={`/countries/${cityData.countrySlug}`}><Button variant="outline">← Kembali ke {cityData.countryName}</Button></Link>
          <Link href="/world-map"><Button variant="primary">🗺️ Peta Interaktif</Button></Link>
        </section>
      </div>
    </div>
  );
}
