"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { countries } from "@/data/countries";

export default function CalculatorPage() {
  const [country, setCountry] = useState("");
  const [duration, setDuration] = useState(7);
  const [budget, setBudget] = useState(5000000);
  const [result, setResult] = useState<null | { total: number; breakdown: { category: string; amount: number }[] }>(null);

  const handleCalculate = () => {
    const selected = countries.find((c) => c.slug === country);
    if (!selected) return;

    const dailyRate = selected.budget / parseInt(selected.duration);
    const total = dailyRate * duration;
    setResult({
      total,
      breakdown: [
        { category: "Akomodasi", amount: total * 0.35 },
        { category: "Makanan", amount: total * 0.25 },
        { category: "Transportasi", amount: total * 0.2 },
        { category: "Aktivitas", amount: total * 0.12 },
        { category: "Lainnya", amount: total * 0.08 },
      ],
    });
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-blue-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🧮</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Backpacking Calculator</h1>
            <p className="text-xl text-slate-300">Hitung estimasi biaya perjalananmu</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pilih Negara</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- Pilih Negara --</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.slug}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Durasi (hari): {duration}</label>
                <input
                  type="range"
                  min={1}
                  max={90}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 hari</span>
                  <span>90 hari</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget (Rp): {budget.toLocaleString()}</label>
                <input
                  type="range"
                  min={1000000}
                  max={50000000}
                  step={500000}
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Rp 1jt</span>
                  <span>Rp 50jt</span>
                </div>
              </div>

              <Button onClick={handleCalculate} variant="primary" size="lg" className="w-full">
                Hitung Estimasi
              </Button>
            </div>
          </Card>

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center font-display">Hasil Estimasi</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold gradient-text">Rp {result.total.toLocaleString()}</span>
                  <p className="text-slate-500 mt-1">Estimasi total untuk {duration} hari</p>
                </div>
                <div className="space-y-3">
                  {result.breakdown.map((item) => (
                    <div key={item.category} className="flex items-center justify-between glass-card px-4 py-3">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-primary-600 font-bold">Rp {item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
                  <span className="text-4xl">📊 Chart Distribusi</span>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
