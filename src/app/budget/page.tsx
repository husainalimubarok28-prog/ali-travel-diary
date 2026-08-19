"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFetch } from "@/hooks/useFetch";
import { useCMS } from "@/hooks/useCMS";
import type { Country } from "@/types";

export default function BudgetPage() {
  const { data: countries, loading } = useFetch<Country[]>("/api/countries", []);
  const { get } = useCMS("budget");

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-green-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">💰</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{get("budget_title", "Travel Budget")}</h1>
            <p className="text-xl text-slate-300">{get("budget_subtitle", "Rincian biaya perjalanan Ali di setiap negara")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country, i) => (
                <motion.div key={country.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link href={`/budget/${country.slug}`}>
                    <Card>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{country.flag}</span>
                        <div>
                          <h3 className="font-bold">{country.name}</h3>
                          <p className="text-xs text-slate-500">{country.continent}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">Total Budget</span>
                        <span className="text-xl font-bold gradient-text">Rp {(country.budget / 1000000).toFixed(1)}jt</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-dark-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-primary-500 rounded-full h-2" style={{ width: `${(country.budget / 15000000) * 100}%` }} />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">⏱️ {country.duration}</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/calculator"><Button variant="primary" size="lg">📊 Backpacking Calculator</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
