"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import { useCMS } from "@/hooks/useCMS";
import type { TravelStatistic } from "@/types";

export default function StatisticsPage() {
  const { data: travelStatistics, loading } = useFetch<TravelStatistic[]>("/api/settings/travelStatistics", []);
  const { get } = useCMS("statistics");

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-cyan-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">📊</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{get("statistics_title", "Travel Statistics")}</h1>
            <p className="text-xl text-slate-300">{get("statistics_subtitle", "Data dan statistik perjalanan Ali")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : travelStatistics.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">📊</span>
              <p className="text-lg text-slate-500">Belum ada data statistik.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {travelStatistics.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="text-center p-6 hover-lift">
                    <span className="text-4xl mb-3 block">{stat.icon}</span>
                    <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-slate-500 mt-2">{stat.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{stat.description}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Route Map */}
          <Card className="mt-12 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center font-display">Route Perjalanan</h2>
            <div className="aspect-[21/9] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <span className="text-6xl block mb-4">🗺️</span>
                <p className="text-lg">Interactive Route Map</p>
                <p className="text-sm">(Coming soon with Mapbox integration)</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
