"use client";

import { Card } from "@/components/ui/Card";

export default function DashboardAiPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-indigo-900">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white font-display">AI Training</h1>
          <p className="text-slate-300">Latih AI dengan data perjalanan</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          <Card className="p-8 text-center text-slate-500 mb-6">
            <span className="text-4xl block mb-4">🤖</span>
            <p className="text-lg mb-4">AI Ask Ali sudah aktif di halaman publik.</p>
            <p className="text-sm">Kunjungi <a href="/ai-ask-ali" className="text-primary-600 underline">/ai-ask-ali</a> untuk melihat dan mencoba.</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Training Data</h2>
            <p className="text-sm text-slate-500 mb-4">AI saat ini menggunakan response berdasarkan keyword. Untuk menambahkan response baru, edit file:</p>
            <code className="block p-3 rounded-lg bg-slate-100 dark:bg-dark-800 text-xs font-mono">src/app/api/ai/route.ts</code>
          </Card>
        </div>
      </section>
    </div>
  );
}
