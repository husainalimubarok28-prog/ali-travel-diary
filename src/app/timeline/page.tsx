"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { useFetch } from "@/hooks/useFetch";
import { useCMS } from "@/hooks/useCMS";
import type { TimelineEvent } from "@/types";

export default function TimelinePage() {
  const { t } = useLanguage();
  const { data: timelineEvents } = useFetch<TimelineEvent[]>("/api/settings/timelineEvents", []);
  const { get } = useCMS("timeline");

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">📅</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{t("timeline.title")}</h1>
            <p className="text-xl text-slate-300">{get("timeline_subtitle", "10 bulan • 21 negara • Tak terbatas cerita")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-6xl mx-auto">
          {/* Horizontal Scrollable Timeline */}
          <div className="relative overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex gap-0 min-w-max px-8">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={`${event.country}-${event.year}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col items-center w-32"
                >
                  {/* Arrow down */}
                  {index > 0 && (
                    <div className="text-slate-300 dark:text-slate-600 text-lg mb-2">
                      ↓
                    </div>
                  )}
                  {/* Event card */}
                  <div className="glass-card p-4 text-center w-28 hover-lift group">
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">
                      {event.icon}
                    </span>
                    <h4 className="font-bold text-xs mb-1">{event.country}</h4>
                    <p className="text-[10px] text-slate-500">{event.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vertical Timeline for Mobile */}
          <div className="md:hidden mt-12 relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />
            <div className="space-y-6 pl-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={`v-${event.country}-${event.year}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-dark-900" />
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{event.icon}</span>
                      <span className="text-xs text-primary-600 font-semibold">{event.year}</span>
                    </div>
                    <h4 className="font-bold">{event.country}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed Timeline */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={`d-${event.country}-${event.year}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5 hover-lift group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{event.icon}</span>
                  <div>
                    <span className="text-xs text-primary-600 font-semibold">{event.year}</span>
                    <h4 className="font-bold">{event.country}</h4>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{event.description}</p>
                <Link
                  href={`/countries/${event.country.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
                >
                  Lihat Detail →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
