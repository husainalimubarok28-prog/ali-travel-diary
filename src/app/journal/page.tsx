"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFetch } from "@/hooks/useFetch";
import { useCMS } from "@/hooks/useCMS";
import type { JournalEntry } from "@/types";

export default function JournalPage() {
  const { data: journalEntries, loading } = useFetch<JournalEntry[]>("/api/journal", []);
  const { get } = useCMS("journal");

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-accent-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">📓</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{get("journal_title", "Travel Journal")}</h1>
            <p className="text-xl text-slate-300">{get("journal_subtitle", "Catatan harian perjalanan Ali. Lebih personal daripada blog.")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : journalEntries.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">📓</span>
              <p className="text-lg text-slate-500">Belum ada journal entries.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {journalEntries.map((entry, i) => (
                <motion.div key={entry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/journal/${entry.slug}`}>
                    <Card className="relative overflow-hidden">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
                          <span className="text-xl">📓</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <span>📅 {new Date(entry.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                            <span>📍 {entry.location}, {entry.country}</span>
                            {entry.temperature != null && <span>🌡️ {entry.temperature}°C</span>}
                          </div>
                          <h3 className="font-bold text-lg mb-1">{entry.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{entry.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {entry.mood && (
                              <span className="px-2 py-0.5 rounded text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                                😊 {entry.mood}
                              </span>
                            )}
                            {entry.weather && (
                              <span className="px-2 py-0.5 rounded text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                🌤️ {entry.weather}
                              </span>
                            )}
                          </div>
                        </div>
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
