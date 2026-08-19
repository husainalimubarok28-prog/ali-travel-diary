"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import type { Video } from "@/types";

export default function VideoPage() {
  const { data: videos, loading } = useFetch<Video[]>("/api/video", []);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>("all");

  const filtered = videos.filter((v) => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platform === "all" || v.platform === platform;
    return matchSearch && matchPlatform;
  });

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-accent-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🎬</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Video Center</h1>
            <p className="text-xl text-slate-300">YouTube • Instagram • TikTok</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Cari video..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex gap-2">
              {["all", "youtube", "instagram", "tiktok"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    platform === p
                      ? "bg-primary-600 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-dark-800 text-slate-600"
                  }`}
                >
                  {p === "all" ? "Semua" : p === "youtube" ? "📺 YouTube" : p === "instagram" ? "📸 IG" : "🎵 TikTok"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">🎬</span>
              <p className="text-lg text-slate-500">Tidak ada video yang cocok.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((video, i) => (
                <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <Card className="p-0 overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 relative flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center hover:bg-primary-600 transition-colors">
                          <span className="text-white text-2xl">▶</span>
                        </div>
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white">
                          {video.platform === "youtube" ? "📺" : video.platform === "instagram" ? "📸" : "🎵"}
                        </div>
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs bg-black/60 text-white">{video.duration}</div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{video.country} • {new Intl.NumberFormat().format(video.views)} views • {new Date(video.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
