"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/Button";
import { useCMS } from "@/hooks/useCMS";

interface BlogPostDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  author?: { name: string };
  publishedAt: string;
  readingTime: number;
  tags: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { get } = useCMS("blog");
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => setPost(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">{get("blog_404_title", "Artikel tidak ditemukan")}</h1>
          <Link href="/blog"><Button variant="primary">{get("blog_back_btn", "Kembali ke Blog")}</Button></Link>
        </div>
      </div>
    );
  }

  const authorName = typeof post.author === "string" ? post.author : post.author?.name || "Ali";
  const tags = (post.tags || "").split(",").filter(Boolean);

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">{post.category.replace("-", " ")}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 font-display">{post.title}</h1>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span>✍️ {authorName}</span>
              <span>📅 {new Date(post.publishedAt).toLocaleDateString("id-ID")}</span>
              <span>📖 {post.readingTime} {get("blog_reading_time_suffix", "menit baca")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="container-custom section-padding max-w-3xl mx-auto">
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary-200 to-accent-200 dark:from-dark-700 dark:to-dark-800 mb-12 flex items-center justify-center overflow-hidden">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">📝</span>
          )}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.excerpt && (
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{post.excerpt}</p>
          )}
          <div
            className="my-8 prose prose-slate dark:prose-invert max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-8">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-800 text-xs font-medium text-slate-600 dark:text-slate-400">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 dark:border-dark-700">
          <Link href="/blog"><Button variant="outline">← {get("blog_back_btn", "Kembali ke Blog")}</Button></Link>
        </div>
      </article>
    </div>
  );
}
