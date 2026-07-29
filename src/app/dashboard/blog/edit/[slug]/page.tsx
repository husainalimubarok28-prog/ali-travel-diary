"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function EditBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("travel-story");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/blog/${params.slug}`)
        .then((r) => r.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category);
          setTags(data.tags);
          setCoverImage(data.coverImage || "");
          setPublished(data.published);
        })
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  if (status === "unauthenticated" || loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setCoverImage(data.url);
    setUploading(false);
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) { alert("Judul wajib diisi"); return; }
    setSaving(true);
    await fetch(`/api/blog/${params.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category, tags, coverImage, published: publish }),
    });
    setSaving(false);
    router.push("/dashboard/blog");
    router.refresh();
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setContent((prev) => prev + `\n![image](${data.url})\n`);
    };
    input.click();
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-8 bg-gradient-to-br from-dark-900 via-dark-800 to-yellow-900">
        <div className="container-custom">
          <h1 className="text-2xl font-bold text-white font-display">Edit Artikel</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Judul</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-xl font-bold border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800">
                  <option value="travel-story">Travel Story</option>
                  <option value="backpacking">Backpacking</option>
                  <option value="budget">Budget</option>
                  <option value="visa">Visa</option>
                  <option value="tips">Tips</option>
                  <option value="student-immersion">Student Immersion</option>
                  <option value="review">Review</option>
                  <option value="food">Food</option>
                  <option value="culture">Culture</option>
                  <option value="islam-around-the-world">Islam Around the World</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} loading={uploading}>📁 Upload</Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Konten (Markdown)</label>
                <Button type="button" variant="ghost" size="sm" onClick={insertImage}>🖼️ Insert Image</Button>
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 font-mono text-sm leading-relaxed" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-dark-700">
              <Button variant="ghost" onClick={() => router.push("/dashboard/blog")}>← Kembali</Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleSave(false)} loading={saving}>💾 Simpan</Button>
                <Button variant="primary" onClick={() => handleSave(true)} loading={saving}>
                  {published ? "📤 Update" : "📤 Publish"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
