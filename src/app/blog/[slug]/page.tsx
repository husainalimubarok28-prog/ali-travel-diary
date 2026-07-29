"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { blogPosts } from "@/data/countries";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">Artikel tidak ditemukan</h1>
          <Link href="/blog"><Button variant="primary">Kembali ke Blog</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">{post.category.replace("-", " ")}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 font-display">{post.title}</h1>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span>✍️ {post.author}</span>
              <span>📅 {new Date(post.publishedAt).toLocaleDateString("id-ID")}</span>
              <span>📖 {post.readingTime} menit baca</span>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="container-custom section-padding max-w-3xl mx-auto">
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary-200 to-accent-200 dark:from-dark-700 dark:to-dark-800 mb-12 flex items-center justify-center">
          <span className="text-6xl">📝</span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{post.excerpt}</p>
          <div className="my-8 p-6 glass-card">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-800 text-xs font-medium text-slate-600 dark:text-slate-400">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 dark:border-dark-700">
          <Link href="/blog"><Button variant="outline">← Kembali ke Blog</Button></Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">👍</Button>
            <Button variant="ghost" size="sm">💬</Button>
            <Button variant="ghost" size="sm">🔗</Button>
          </div>
        </div>
      </article>
    </div>
  );
}
