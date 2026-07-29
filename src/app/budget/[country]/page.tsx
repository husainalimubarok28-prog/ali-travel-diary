"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCountryBySlug } from "@/data/countries";

export default function CountryBudgetPage() {
  const { country: slug } = useParams<{ country: string }>();
  const country = getCountryBySlug(slug);

  if (!country) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">Negara tidak ditemukan</h1>
          <Link href="/budget"><Button variant="primary">Kembali</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-green-900" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-5xl mb-4 block">{country.flag}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">Budget {country.name}</h1>
            <p className="text-xl text-slate-300">Total: Rp {(country.budget / 1000000).toFixed(1)} Juta</p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom section-padding space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display">Rincian Biaya</h2>
            {country.budgetBreakdown.length > 0 ? (
              country.budgetBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between glass-card px-4 py-3">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-primary-600 font-bold">Rp {item.amount.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Data budget akan segera dilengkapi.</p>
            )}
            <div className="flex items-center justify-between glass-card px-4 py-3 bg-primary-50 dark:bg-primary-900/20">
              <span className="font-bold">Total Estimasi</span>
              <span className="text-primary-600 font-bold text-xl">Rp {country.budget.toLocaleString()}</span>
            </div>
          </div>

          <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl block mb-4">📊</span>
              <p className="text-lg font-medium">Grafik Biaya</p>
              <p className="text-sm text-slate-500">(Chart akan ditampilkan di sini)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/calculator"><Button variant="primary">📊 Backpacking Calculator</Button></Link>
          <Link href={`/countries/${country.slug}`}><Button variant="outline">← Detail {country.name}</Button></Link>
          <Link href="/budget"><Button variant="outline">💰 Semua Budget</Button></Link>
        </div>
      </div>
    </div>
  );
}
