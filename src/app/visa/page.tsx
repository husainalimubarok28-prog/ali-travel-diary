"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { visaInfoList } from "@/data/countries";

export default function VisaPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-indigo-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🛂</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Visa Center</h1>
            <p className="text-xl text-slate-300">Informasi visa lengkap untuk backpacker Indonesia</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-6">
            {visaInfoList.map((visa, i) => (
              <motion.div key={visa.country} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 md:w-48">
                      <span className="text-3xl">{visa.flag}</span>
                      <div>
                        <h3 className="font-bold">{visa.country}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          visa.cost === 0 ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700"
                        }`}>
                          {visa.cost === 0 ? "🆓 Gratis" : `$${(visa.cost / 16000).toFixed(0)}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 block">Tipe Visa</span>
                        <span className="font-medium">{visa.visaType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Durasi</span>
                        <span className="font-medium">{visa.duration}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Proses</span>
                        <span className="font-medium">{visa.processingTime}</span>
                      </div>
                    </div>
                  </div>
                  {visa.documents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-700">
                      <span className="text-sm font-semibold mb-2 block">📋 Dokumen:</span>
                      <div className="flex flex-wrap gap-2">
                        {visa.documents.map((doc, j) => (
                          <span key={j} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-dark-800">{doc}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {visa.tips.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-semibold mb-1 block">💡 Tips:</span>
                      <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
                        {visa.tips.map((tip, j) => <li key={j}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                  {visa.link && (
                    <div className="mt-3">
                      <a href={visa.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                        🔗 Link Resmi →
                      </a>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
