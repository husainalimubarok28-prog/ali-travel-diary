"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
  author: { name: string };
}

export default function DashboardBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const handleDelete = async (slug: string) => {
    if (!confirm("Yakin mau hapus?")) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setPosts((p) => p.filter((b) => b.slug !== slug));
  };

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/blog/${post.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    setPosts((p) => p.map((b) => (b.id === post.id ? { ...b, published: !b.published } : b)));
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-yellow-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Blog</h1>
              <p className="text-slate-300">Kelola artikel blog ({posts.length})</p>
            </div>
            <Button variant="primary" onClick={() => router.push("/dashboard/blog/new")}>
              + Tulis Artikel
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {posts.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="text-5xl block mb-4">📝</span>
              <p className="text-lg text-slate-500">Belum ada artikel.</p>
              <Button variant="primary" className="mt-4" onClick={() => router.push("/dashboard/blog/new")}>
                Tulis Artikel Pertama
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          post.published ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                        }`}>
                          {post.published ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-slate-400">{post.category}</span>
                      </div>
                      <h3 className="font-bold truncate">{post.title}</h3>
                      <p className="text-xs text-slate-500">
                        {new Date(post.publishedAt).toLocaleDateString("id-ID")} • {post.author?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => togglePublish(post)}>
                        {post.published ? "📄" : "📝"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/blog/edit/${post.slug}`)}>
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.slug)} className="text-red-500">
                        🗑️
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
