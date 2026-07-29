"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className="text-8xl block mb-6">😕</span>
        <h1 className="text-4xl font-bold mb-4 font-display">Halaman Tidak Ditemukan</h1>
        <p className="text-lg text-slate-500 mb-8 max-w-md">
          Maaf, halaman yang kamu cari tidak ada. Mungkin sudah dipindah atau dihapus.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/"><Button variant="primary" size="lg">Kembali ke Beranda</Button></Link>
          <Link href="/search"><Button variant="outline" size="lg">🔍 Cari</Button></Link>
        </div>
      </div>
    </div>
  );
}
