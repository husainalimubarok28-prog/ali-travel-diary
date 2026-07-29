"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<{ id: string; src: string; alt: string; category: string; country: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/gallery").then(r => r.json()).then(setItems);
  }, []);

  if (status === "unauthenticated") return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", file.name);
    formData.append("category", "street");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const { url } = await res.json();
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: url, alt: file.name, category: "street" }),
      });
      const updated = await fetch("/api/gallery").then(r => r.json());
      setItems(updated);
    } catch (e) {
      alert("Upload gagal");
    }
    setUploading(false);
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-purple-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Gallery</h1>
              <p className="text-slate-300">{items.length} items</p>
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <Button variant="primary" onClick={() => fileInputRef.current?.click()} loading={uploading}>
                + Upload Gambar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="text-5xl block mb-4">🖼️</span>
              <p className="text-lg text-slate-500">Belum ada gambar.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="aspect-square rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 overflow-hidden relative group"
                >
                  <img src={item.src} alt={item.alt} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{item.alt}</p>
                    <span className="text-white/60 text-[10px]">{item.category}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
