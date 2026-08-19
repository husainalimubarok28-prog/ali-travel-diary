"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { travelStatistics, timelineEvents } from "@/data/countries";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.section>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState({ name: "", avatar: "" });
  const [cms, setCms] = useState<Record<string, { key: string; value: string }[]>>({});

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      setProfile({ name: data.name || "", avatar: data.avatar || "" });
    }).catch(() => {});
    fetch("/api/cms").then(r => r.json()).then(data => setCms(data)).catch(() => {});
  }, []);

  const cmsVal = (key: string, fallback: string) => {
    for (const cat of Object.values(cms)) {
      const found = (cat as any[]).find((c: any) => c.key === key);
      if (found) return found.value;
    }
    return fallback;
  };

  const cmsParagraphs = (key: string, fallback: string[]) => {
    try { return JSON.parse(cmsVal(key, JSON.stringify(fallback))); }
    catch { return fallback; }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-900 to-accent-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="Ali" className="w-28 h-28 md:w-36 md:h-36 rounded-full mx-auto object-cover border-4 border-primary-400 shadow-xl mb-6" />
            ) : (
              <span className="text-7xl mb-6 block">🧑‍✈️</span>
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
              Tentang <span className="gradient-text">Ali</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Bukan sekadar biodata. Ini adalah cerita tentang mimpi, keberanian, dan petualangan tanpa batas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Siapa Ali */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-display">{cmsVal("about_who_title", t("about.who"))}</h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                {cmsParagraphs("about_who_content", ["Husain Ali Mubarok, seorang backpacker Indonesia yang telah menjelajahi 21 negara dalam 10 bulan.", "Berawal dari rasa penasaran yang besar terhadap dunia, Ali memutuskan untuk mengambil langkah pertama sebagai backpacker solo.", "Selain traveling, Ali juga aktif dalam program Student Immersion."]).map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-200 to-accent-200 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
              {profile.avatar ? <img src={profile.avatar} alt="Ali" className="w-full h-full object-cover" /> : <span className="text-8xl">🧑‍✈️</span>}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Awal Mula */}
      <AnimatedSection className="section-padding bg-slate-50 dark:bg-dark-800/50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <span className="text-4xl mb-4 block">🌟</span>
              <h3 className="text-xl font-bold mb-3">{cmsVal("about_story_title", t("about.start"))}</h3>
              <div className="text-slate-500 dark:text-slate-400 space-y-2">
                {cmsParagraphs("about_story_content", ["Semuanya bermula dari mimpi sederhana: ingin melihat dunia.", "Negara demi negara ia kunjungi, belajar budaya baru.", "Setiap perjalanan adalah cerita."]).map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Card>
            <Card>
              <span className="text-4xl mb-4 block">🎒</span>
              <h3 className="text-xl font-bold mb-3">{t("about.backpacker")}</h3>
              <p className="text-slate-500 dark:text-slate-400">Backpacking pertama ke Malaysia dengan budget minim dan persiapan yang pas-pasan.</p>
            </Card>
            <Card>
              <span className="text-4xl mb-4 block">📚</span>
              <h3 className="text-xl font-bold mb-3">{t("about.teach")}</h3>
              <p className="text-slate-500 dark:text-slate-400">Mengajar di sekolah-sekolah lokal sambil traveling, menggabungkan passion dan profesi.</p>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Achievement Stats */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">
            <span className="gradient-text">Achievements</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {travelStatistics.map((stat) => (
              <Card key={stat.label} className="text-center p-6">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Story Timeline */}
      <AnimatedSection className="section-padding bg-slate-50 dark:bg-dark-800/50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">
            <span className="gradient-text">{cmsVal("about_milestones_title", t("about.timeline"))}</span>
          </h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-px w-0.5 h-full bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 hidden md:block" />
            <div className="space-y-8">
              {timelineEvents.slice(0, 10).map((event, index) => (
                <motion.div
                  key={event.country + event.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass-card p-4 inline-block">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{event.year}</span>
                      <h4 className="font-bold mt-1">{event.icon} {event.country}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{event.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-8 h-8 rounded-full bg-primary-500 ring-4 ring-white dark:ring-dark-900 items-center justify-center text-white text-sm flex-shrink-0 z-10">
                    {index + 1}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="/timeline"><Button variant="outline">Lihat Timeline Lengkap</Button></a>
          </div>
        </div>
      </AnimatedSection>

      {/* Future Mission */}
      <AnimatedSection className="section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="text-5xl mb-4 block">🚀</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">{t("about.mission")}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Ali berencana untuk terus menjelajahi lebih banyak negara, mengembangkan Student Immersion program,
            dan menciptakan platform edukasi traveling yang bermanfaat bagi banyak orang.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <span className="text-3xl mb-3 block">🌍</span>
              <h4 className="font-bold">50 Countries</h4>
              <p className="text-sm text-slate-500">Target menjelajahi 50 negara</p>
            </Card>
            <Card>
              <span className="text-3xl mb-3 block">📚</span>
              <h4 className="font-bold">Ali Travel Academy</h4>
              <p className="text-sm text-slate-500">Kursus backpacking online</p>
            </Card>
            <Card>
              <span className="text-3xl mb-3 block">🤝</span>
              <h4 className="font-bold">Global Community</h4>
              <p className="text-sm text-slate-500">Membangun komunitas traveler Indonesia</p>
            </Card>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
