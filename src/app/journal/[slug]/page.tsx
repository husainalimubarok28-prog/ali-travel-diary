"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import { useCMS } from "@/hooks/useCMS";
import type { JournalEntry } from "@/types";

export default function JournalDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { get } = useCMS("journal");
  const { data: entry, loading } = useFetch<JournalEntry | null>(`/api/journal/${slug}`, null);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">{get("journal_404_title", "Entry tidak ditemukan")}</h1>
          <Link href="/journal"><Button variant="primary">{get("journal_back_btn", "Kembali")}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-accent-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">{entry.title}</h1>
          <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
            <span>📅 {new Date(entry.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            <span>📍 {entry.location}, {entry.country}</span>
            {entry.temperature != null && <span>🌡️ {entry.temperature}°C</span>}
            {entry.mood && <span>😊 {entry.mood}</span>}
          </div>
        </div>
      </section>

      <article className="container-custom section-padding max-w-3xl mx-auto">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {entry.images.map((img, i) => (
            <div key={i} className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
              <span className="text-4xl">📸</span>
            </div>
          ))}
        </div>

        <Card>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{entry.content}</p>
        </Card>

        <div className="flex justify-between mt-8">
          <Link href="/journal"><Button variant="outline">← {get("journal_all_btn", "Semua Journal")}</Button></Link>
        </div>
      </article>
    </div>
  );
}
