"use client";

import { Card } from "@/components/ui/Card";

export default function DashboardAiPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-indigo-900">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white font-display">AI Training</h1>
          <p className="text-slate-300">Kelola data AI</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <Card className="p-8 text-center text-slate-500">
            <span className="text-4xl block mb-4">🤖</span>
            <p>Dashboard AI training akan segera hadir.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
