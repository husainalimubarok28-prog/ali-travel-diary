"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { blogPosts } from "@/data/countries";
import type { BlogCategory } from "@/types";

const categories: { value: BlogCategory | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "backpacking", label: "🎒 Backpacking" },
  { value: "budget", label: "💰 Budget" },
  { value: "visa", label: "🛂 Visa" },
  { value: "tips", label: "💡 Tips" },
  { value: "student-immersion", label: "📚 Student Immersion" },
  { value: "travel-story", label: "📖 Travel Story" },
  { value: "review", label: "⭐ Review" },
  { value: "food", label: "🍜 Food" },
  { value: "culture", label: "🎭 Culture" },
  { value: "islam-around-the-world", label: "🕌 Islam" },
];

export default function BlogPage() {
  const [category, setCategory] = useState<BlogCategory | "all">("all");

  const filtered = category === "all" ? blogPosts : blogPosts.filter((p) => p.category === category);

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">📝</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Blog</h1>
            <p className="text-xl text-slate-300">Cerita, tips, dan panduan backpacking dari Ali</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full">
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 mb-4 flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                      {post.category.replace("-", " ")}
                    </span>
                    <h3 className="font-bold mt-1 mb-2">{post.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                      <span>📖 {post.readingTime} menit</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
