"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const roadmapPhases = [
  {
    phase: "Fase 1 - MVP",
    status: "✅ Selesai",
    items: [
      "Landing Page",
      "About Ali",
      "Interactive World Map (dasar)",
      "Travel Timeline",
      "Countries Explorer",
      "Blog",
      "Gallery",
      "Dark Mode",
      "Multi Language (ID/EN/AR)",
      "SEO Professional",
    ],
  },
  {
    phase: "Fase 2 - Fitur Lanjutan",
    status: "🔄 Development",
    items: [
      "AI Ask Ali (conversational)",
      "Backpacking Calculator",
      "Visa Center",
      "Travel Budget Detail",
      "Video Center",
      "Travel Journal",
      "City Explorer",
      "Search Global",
    ],
  },
  {
    phase: "Fase 3 - Komunitas & Admin",
    status: "📋 Planned",
    items: [
      "Dashboard Admin",
      "CMS",
      "Community Forum",
      "Authentication (Supabase)",
      "Student Immersion Program",
      "Travel Resources Download",
      "Backpacking Checklist",
      "Packing List Generator",
    ],
  },
  {
    phase: "Fase 4 - Premium",
    status: "🚀 Future",
    items: [
      "Ali Travel Academy",
      "Open Trip & Booking",
      "Marketplace (E-book, Merch)",
      "Travel Partner Directory",
      "Travel API",
      "Mobile App (React Native)",
      "Travel Statistics Dashboard",
      "Heatmap Analytics",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-violet-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🗺️</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Future Roadmap</h1>
            <p className="text-xl text-slate-300">Website modular yang siap berkembang</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {roadmapPhases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold font-display">{phase.phase}</h3>
                    <span className="text-sm font-semibold">{phase.status}</span>
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-green-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Future Vision */}
          <Card className="mt-12 p-8 text-center">
            <span className="text-5xl mb-4 block">🔮</span>
            <h2 className="text-3xl font-bold mb-4 font-display">Future Vision</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: "🎓", title: "Ali Travel Academy", desc: "Kursus backpacking online" },
                { icon: "🏕️", title: "Open Trip & Booking", desc: "Student Immersion booking" },
                { icon: "📱", title: "Mobile App", desc: "React Native/Expo" },
              ].map((item) => (
                <div key={item.title}>
                  <span className="text-4xl mb-3 block">{item.icon}</span>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
