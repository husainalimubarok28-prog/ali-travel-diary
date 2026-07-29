"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CMSPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-emerald-900" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">CMS</h1>
            <p className="text-xl text-slate-300">Content Management System</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <span className="text-3xl mb-3 block">🖼️</span>
              <h3 className="font-bold mb-2">Upload Media</h3>
              <p className="text-sm text-slate-500 mb-4">Upload gambar dan video</p>
              <div className="border-2 border-dashed border-slate-300 dark:border-dark-600 rounded-xl p-8 text-center">
                <p className="text-sm text-slate-400">Drop files here</p>
              </div>
            </Card>

            <Card>
              <span className="text-3xl mb-3 block">📝</span>
              <h3 className="font-bold mb-2">Markdown Editor</h3>
              <p className="text-sm text-slate-500 mb-4">Tulis konten dengan markdown</p>
              <div className="grid grid-cols-2 gap-2">
                <textarea rows={6} placeholder="Markdown..." className="px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-xs" />
                <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-800 text-xs text-slate-400">Preview</div>
              </div>
            </Card>

            <Card>
              <span className="text-3xl mb-3 block">🔍</span>
              <h3 className="font-bold mb-2">SEO Editor</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 block">Title</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">Meta Description</label>
                  <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">Slug</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm" />
                </div>
              </div>
            </Card>
          </div>

          {/* Article List */}
          <Card className="mt-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display">Articles</h2>
              <Button variant="primary" size="sm">+ New Post</Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 flex items-center justify-center text-xs">📝</span>
                    <div>
                      <p className="font-medium text-sm">Blog Article {i}</p>
                      <p className="text-xs text-slate-500">Draft • Last edited 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${i === 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {i === 1 ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-slate-400">🗓️ Schedule</span>
                    <Button variant="ghost" size="sm">✏️</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
