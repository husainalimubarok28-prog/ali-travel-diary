"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DashboardSettingsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-slate-900">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white font-display">Settings</h1>
          <p className="text-slate-300">Pengaturan website</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          <Card className="p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <input type="text" defaultValue="Ali Travel Diary" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Site Description</label>
                <textarea rows={3} defaultValue="Jelajahi 21 negara dalam 10 bulan bersama Ali." className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800" />
              </div>
              <div className="flex gap-2">
                <label className="block text-sm font-medium mb-2">Dark Mode</label>
                <select className="px-3 py-2 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800">
                  <option>Auto</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <Button type="submit" variant="primary">Simpan Pengaturan</Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
