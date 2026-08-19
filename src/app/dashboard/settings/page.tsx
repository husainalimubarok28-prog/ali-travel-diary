"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DashboardSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      setName(data.name || "");
      setAvatar(data.avatar || "");
    });
  }, []);

  if (status === "unauthenticated") return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      setAvatar(url);
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar: url }),
      });
    } catch { alert("Upload gagal"); }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });
    setSaving(false);
    alert("Profil tersimpan!");
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-slate-900">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white font-display">Settings</h1>
          <p className="text-slate-300">Pengaturan profil & website</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto space-y-6">
          {/* Profile Photo */}
          <Card className="p-8">
            <h2 className="text-lg font-bold mb-4">Foto Profil</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-300 to-accent-300 flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <Button variant="primary" onClick={() => fileRef.current?.click()} loading={uploading}>
                  {avatar ? "Ganti Foto" : "Upload Foto"}
                </Button>
                <p className="text-xs text-slate-500 mt-2">Foto akan tampil di halaman About & Landing</p>
              </div>
            </div>
          </Card>

          {/* Profile Info */}
          <Card className="p-8">
            <h2 className="text-lg font-bold mb-4">Data Diri</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" value={session?.user?.email || ""} disabled className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 opacity-60" />
              </div>
              <Button variant="primary" onClick={handleSave} loading={saving}>Simpan Profil</Button>
            </div>
          </Card>

          {/* Website Info */}
          <Card className="p-8">
            <h2 className="text-lg font-bold mb-4">Info Website</h2>
            <p className="text-sm text-slate-500 mb-4">Semua konten website bisa diubah lewat:</p>
            <ul className="text-sm space-y-2">
              <li>📝 <strong>CMS Editor</strong> → edit teks halaman (hero, about, stats) di <a href="/cms" className="text-primary-600 underline">/cms</a></li>
              <li>📰 <strong>Blog</strong> → di <a href="/dashboard/blog" className="text-primary-600 underline">Dashboard Blog</a></li>
              <li>🖼️ <strong>Gallery & Video</strong> → di dashboard masing-masing</li>
              <li>👤 <strong>Foto profil</strong> → upload di atas ini</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="/cms"><Button variant="primary">Buka CMS Editor</Button></a>
              <a href="/dashboard/blog"><Button variant="secondary">Blog</Button></a>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
