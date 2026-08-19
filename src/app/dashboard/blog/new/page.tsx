"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function NewBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("travel-story");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setCoverImage(data.url);
    } catch {
      alert("Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      alert("Judul wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category,
          tags,
          coverImage,
          published: publish,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/blog");
        router.refresh();
      } else {
        alert("Gagal menyimpan");
      }
    } catch {
      alert("Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-8 bg-gradient-to-br from-dark-900 via-dark-800 to-yellow-900">
        <div className="container-custom">
          <h1 className="text-2xl font-bold text-white font-display">Tulis Artikel Baru</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Judul Artikel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul artikel..."
                className="w-full px-4 py-3 rounded-xl text-xl font-bold border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800"
                >
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
                <label className="block text-sm font-medium mb-2">Tags (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="travel, backpacking, tips"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="URL gambar atau upload..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} loading={uploading}>
                  📁 Upload
                </Button>
              </div>
              {coverImage && (
                <div className="mt-2 aspect-video max-w-sm rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 flex items-center justify-center overflow-hidden">
                  <img src={coverImage} alt="cover" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <label className="text-sm font-medium mb-2 block">Konten (Rich Text Editor)</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-dark-700">
              <Button variant="ghost" onClick={() => router.push("/dashboard/blog")}>
                ← Kembali
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleSave(false)} loading={saving}>
                  💾 Simpan Draft
                </Button>
                <Button variant="primary" onClick={() => handleSave(true)} loading={saving}>
                  📤 Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
