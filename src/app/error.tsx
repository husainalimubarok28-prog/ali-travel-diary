"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className="text-8xl block mb-6">💥</span>
        <h1 className="text-4xl font-bold mb-4 font-display">Ada yang Error!</h1>
        <p className="text-lg text-slate-500 mb-8 max-w-md">
          Maaf, terjadi kesalahan. Tim Ali sudah diberitahu dan akan segera memperbaikinya.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" onClick={reset}>Coba Lagi</Button>
          <a href="/"><Button variant="outline" size="lg">Kembali ke Beranda</Button></a>
        </div>
      </div>
    </div>
  );
}
