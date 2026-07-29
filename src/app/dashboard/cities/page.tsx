"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DashboardCitiesPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-green-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Cities</h1>
              <p className="text-slate-300">Kelola data kota</p>
            </div>
            <Button variant="primary">+ Tambah Kota</Button>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <Card className="p-8 text-center text-slate-500">
            <span className="text-4xl block mb-4">🏙️</span>
            <p>Dashboard manajemen kota akan segera hadir dengan fitur CRUD lengkap.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
