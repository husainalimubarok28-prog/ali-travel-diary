"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import type { Country, Video } from "@/types";

interface BlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
}

type SearchCategory = "all" | "countries" | "blog" | "video" | "gallery";

export default function SearchPage() {
  const { data: countries } = useFetch<Country[]>("/api/countries", []);
  const { data: blogPosts } = useFetch<BlogPostCard[]>("/api/blog?published=true", []);
  const { data: videos } = useFetch<Video[]>("/api/video", []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");

  const results = {
    countries: countries.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.nameId.toLowerCase().includes(query.toLowerCase()) ||
      c.continent.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
    ),
    blog: blogPosts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      (p.tags || "").toLowerCase().includes(query.toLowerCase())
    ),
    video: videos.filter((v) =>
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.country.toLowerCase().includes(query.toLowerCase())
    ),
  };

  const hasResults = results.countries.length > 0 || results.blog.length > 0 || results.video.length > 0;

  const categories: { value: SearchCategory; label: string; icon: string }[] = [
    { value: "all", label: "Semua", icon: "🔍" },
    { value: "countries", label: "Negara", icon: "🌍" },
    { value: "blog", label: "Blog", icon: "📝" },
    { value: "video", label: "Video", icon: "🎬" },
    { value: "gallery", label: "Galeri", icon: "🖼️" },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🔍</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Pencarian Global</h1>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Cari negara, blog, video, galeri..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-2xl text-lg border-2 border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {!query && (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🔍</span>
              <p className="text-xl text-slate-500">Mulai ketik untuk mencari...</p>
            </div>
          )}

          {query && !hasResults && (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">😕</span>
              <p className="text-xl text-slate-500">Tidak ada hasil untuk "{query}"</p>
            </div>
          )}

          {query && hasResults && (
            <div className="space-y-8">
              {(category === "all" || category === "countries") && results.countries.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 font-display">🌍 Negara ({results.countries.length})</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {results.countries.map((c) => (
                      <Link key={c.id} href={`/countries/${c.slug}`}>
                        <Card className="flex items-center gap-3">
                          <span className="text-3xl">{c.flag}</span>
                          <div>
                            <h3 className="font-bold">{c.name}</h3>
                            <p className="text-xs text-slate-500">{c.continent}</p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(category === "all" || category === "blog") && results.blog.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 font-display">📝 Blog ({results.blog.length})</h2>
                  <div className="space-y-4">
                    {results.blog.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <Card>
                          <span className="text-xs text-primary-600 font-semibold uppercase">{post.category}</span>
                          <h3 className="font-bold">{post.title}</h3>
                          <p className="text-sm text-slate-500">{post.excerpt.slice(0, 120)}...</p>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(category === "all" || category === "video") && results.video.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 font-display">🎬 Video ({results.video.length})</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {results.video.map((v) => (
                      <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer">
                        <Card className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">▶</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{v.title}</h3>
                            <p className="text-xs text-slate-500">{v.country} • {v.platform}</p>
                          </div>
                        </Card>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
