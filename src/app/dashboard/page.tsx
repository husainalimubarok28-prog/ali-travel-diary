"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

const dashboardItems = [
  { href: "/cms", icon: "📝", label: "CMS Editor", color: "from-emerald-500 to-teal-500" },
  { href: "/dashboard/countries", icon: "🌍", label: "Countries", color: "from-blue-500 to-cyan-500", count: 21 },
  { href: "/dashboard/cities", icon: "🏙️", label: "Cities", color: "from-green-500 to-teal-500", count: 45 },
  { href: "/dashboard/gallery", icon: "🖼️", label: "Gallery", color: "from-purple-500 to-pink-500", count: 500 },
  { href: "/dashboard/video", icon: "🎬", label: "Video", color: "from-red-500 to-orange-500", count: 100 },
  { href: "/dashboard/blog", icon: "📝", label: "Blog", color: "from-yellow-500 to-amber-500", count: 50 },
  { href: "/dashboard/ai", icon: "🤖", label: "AI Training", color: "from-indigo-500 to-purple-500", count: 200 },
  { href: "/dashboard/users", icon: "👥", label: "Users", color: "from-pink-500 to-rose-500", count: 150 },
  { href: "/dashboard/newsletter", icon: "📬", label: "Newsletter", color: "from-teal-500 to-emerald-500", count: 300 },
  { href: "/dashboard/immersion", icon: "🎓", label: "Student Immersion", color: "from-cyan-500 to-blue-500", count: 25 },
  { href: "/dashboard/media", icon: "📁", label: "Media", color: "from-orange-500 to-red-500", count: 1024 },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings", color: "from-slate-500 to-slate-600" },
];

export default function DashboardPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">Dashboard Admin</h1>
            <p className="text-slate-300">Kelola konten dan data Ali Travel Diary</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dashboardItems.map((item, i) => (
              <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={item.href}>
                  <Card className="relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h3 className="font-bold">{item.label}</h3>
                        {item.count && <p className="text-sm text-slate-500">{item.count} items</p>}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Analytics Overview */}
          <Card className="mt-8 p-8">
            <h2 className="text-2xl font-bold mb-6 font-display">Analytics Overview</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: "Page Views", value: "12,450", change: "+12%", icon: "👁️" },
                { label: "Popular Country", value: "Mesir", change: "", icon: "🌍" },
                { label: "Popular Blog", value: "Tips Visa Schengen", change: "", icon: "📝" },
                { label: "Popular Video", value: "Backpacking Eropa", change: "", icon: "🎬" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-2xl mb-2 block">{stat.icon}</span>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  {stat.change && <span className="text-xs text-green-500">{stat.change}</span>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
