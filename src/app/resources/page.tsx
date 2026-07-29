"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const resources = [
  { title: "Proposal Student Immersion", desc: "Download proposal program Student Immersion", icon: "📄", type: "PDF" },
  { title: "Backpacking Checklist", desc: "Checklist lengkap persiapan backpacking", icon: "✅", type: "PDF" },
  { title: "Template Budget Travel", desc: "Excel template untuk tracking pengeluaran", icon: "📊", type: "XLSX" },
  { title: "Travel Planner", desc: "Rencanakan perjalananmu dengan planner ini", icon: "📅", type: "PDF" },
  { title: "Packing List Template", desc: "Template packing list yang bisa diedit", icon: "🎒", type: "DOCX" },
  { title: "Travel Journal Template", desc: "Template jurnal perjalanan harian", icon: "📓", type: "PDF" },
];

export default function ResourcesPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-amber-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">📦</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Travel Resources</h1>
            <p className="text-xl text-slate-300">Download template dan dokumen perjalanan gratis</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, i) => (
              <motion.div key={resource.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="text-center">
                  <span className="text-5xl mb-4 block">{resource.icon}</span>
                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{resource.desc}</p>
                  <Button variant="outline" size="sm">📥 Download {resource.type}</Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
