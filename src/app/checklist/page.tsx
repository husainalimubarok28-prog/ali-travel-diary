"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { packingItems } from "@/data/countries";

export default function ChecklistPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const categories = Array.from(new Set(packingItems.map((item) => item.category)));

  const toggleItem = (id: string) => {
    setChecked((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const progress = (checked.length / packingItems.length) * 100;

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-emerald-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">✅</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Backpacking Checklist</h1>
            <p className="text-xl text-slate-300">Pastikan tidak ada yang ketinggalan!</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-bold text-primary-600">{checked.length}/{packingItems.length}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-dark-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-full h-3 transition-all"
              />
            </div>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold mb-4 font-display">{category}</h3>
              <div className="space-y-2">
                {packingItems.filter((item) => item.category === category).map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 glass-card px-4 py-3 cursor-pointer transition-all ${
                      checked.includes(item.id) ? "ring-2 ring-primary-500" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded accent-primary-600"
                    />
                    <span className={`flex-1 font-medium ${checked.includes(item.id) ? "line-through text-slate-400" : ""}`}>
                      {item.name}
                    </span>
                    {item.essential && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold">
                        Penting!
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
