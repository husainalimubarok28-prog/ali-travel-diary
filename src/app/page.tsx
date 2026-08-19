"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useFetch } from "@/hooks/useFetch";
import type { Country, Testimonial, Video, TravelStatistic } from "@/types";

interface BlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  publishedAt: string;
  readingTime: number;
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: "easeOut" }} className={className}>
      {children}
    </motion.section>
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const [profileAvatar, setProfileAvatar] = useState("");
  const [cms, setCms] = useState<Record<string, { key: string; value: string }[]>>({});

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => { if (d.avatar) setProfileAvatar(d.avatar); }).catch(() => {});
    fetch("/api/cms").then(r => r.json()).then(d => setCms(d)).catch(() => {});
  }, []);

  const v = (key: string, fb: string) => {
    for (const cat of Object.values(cms)) {
      const f = (cat as any[]).find((c: any) => c.key === key);
      if (f) return f.value;
    }
    return fb;
  };

  const { data: videos } = useFetch<Video[]>("/api/video", []);
  const { data: blogPosts } = useFetch<BlogPostCard[]>("/api/blog?featured=true&published=true&limit=3", []);
  const { data: testimonials } = useFetch<Testimonial[]>("/api/testimonials", []);
  const { data: countries } = useFetch<Country[]>("/api/countries", []);

  let statsList: TravelStatistic[] = [];
  try {
    statsList = JSON.parse(v("stats", "[]"));
  } catch {}

  let partners: string[] = [];
  try {
    partners = JSON.parse(v("partners_list", "[]"));
  } catch {}

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
          <div className="absolute inset-0 bg-world-map opacity-10 animate-pulse-soft" />
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 container-custom text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mb-6">
            {profileAvatar ? (
              <img src={profileAvatar} alt="Ali" className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover border-4 border-primary-400 shadow-xl" />
            ) : (
              <span className="inline-block text-7xl md:text-9xl mb-4 animate-float">✈️</span>
            )}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-display">
            {v("hero_title", t("hero.title"))}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mb-8">
            <span className="inline-block text-xl md:text-2xl text-primary-300 font-mono border-r-2 border-primary-400 pr-1 typing-animation">
              {v("hero_subtitle", t("hero.subtitle"))}
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/countries"><Button size="xl" variant="primary">{v("hero_cta", t("hero.cta"))}</Button></Link>
            <Link href="/timeline"><Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">{v("hero_cta2", t("hero.cta2"))}</Button></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }} className="mt-16 grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {(statsList.length > 0 ? statsList.slice(0, 6) : [
              { label: "Negara Dikunjungi", value: countries.length || 21, icon: "🌍" },
            ]).map((stat, i) => (
              <div key={stat.label || i} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-dark-900 to-transparent" />
      </section>

      {/* Featured Story */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display"><span className="gradient-text">{v("featured_title", t("featured.title"))}</span></h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-200 to-accent-200 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center text-4xl text-slate-400">📖 Cerita Utama</div>
            <div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Featured</span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">{v("featured_heading", "Backpacking 21 Negara dalam 10 Bulan")}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{v("featured_text", "Bagaimana seorang backpacker Indonesia bisa menjelajahi 21 negara dalam 10 bulan dengan budget terbatas.")}</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/blog/backpacking-21-negara-10-bulan"><Button variant="primary">{v("featured_cta", "Baca Cerita Lengkap")}</Button></Link>
                <Link href="/blog"><Button variant="outline">Semua Blog</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Latest Video */}
      <AnimatedSection className="section-padding bg-slate-50 dark:bg-dark-800/50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display"><span className="gradient-text">{v("video_preview_title", t("latest.title"))}</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((video) => (
              <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="p-0 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-primary-600 transition-colors"><span className="text-white text-2xl">▶</span></div></div>
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white">{video.platform === "youtube" ? "📺 YouTube" : video.platform === "instagram" ? "📸 Instagram" : "🎵 TikTok"}</div>
                    {video.duration && <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs bg-black/60 text-white">{video.duration}</div>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-primary-600 transition-colors">{video.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{video.country} • {new Intl.NumberFormat().format(video.views)} views</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
          <div className="text-center mt-8"><Link href="/video"><Button variant="outline">Lihat Semua Video</Button></Link></div>
        </div>
      </AnimatedSection>

      {/* Latest Blog */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display"><span className="gradient-text">{v("blog_preview_title", t("latest.blog"))}</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 mb-4 flex items-center justify-center text-slate-400 overflow-hidden">
                    {post.coverImage ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" /> : <span>📝 {post.category}</span>}
                  </div>
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{post.category}</span>
                  <h3 className="font-semibold mt-1 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                    <span>{post.readingTime} menit baca</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8"><Link href="/blog"><Button variant="outline">Semua Blog</Button></Link></div>
        </div>
      </AnimatedSection>

      {/* Gallery Preview */}
      <AnimatedSection className="section-padding bg-slate-50 dark:bg-dark-800/50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display"><span className="gradient-text">{v("gallery_preview_title", t("gallery.title"))}</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Egypt", "Turkey", "Nepal", "Morocco", "Vietnam", "Thailand", "Germany", "Japan"].map((country, i) => (
              <div key={country} className={`relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br ${i < 4 ? "md:row-span-2 md:col-span-1" : ""} ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200/50 to-accent-200/50 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center"><span className="text-4xl opacity-50">📸</span></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4"><span className="text-white font-semibold">{country}</span></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8"><Link href="/gallery"><Button variant="outline">Lihat Semua Gallery</Button></Link></div>
        </div>
      </AnimatedSection>

      {/* Student Immersion CTA */}
      <AnimatedSection className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-accent-900 to-primary-900" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <span className="text-6xl mb-4 block">🎓</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">{v("immersion_cta_title", t("student.cta"))}</h2>
            <p className="text-lg text-primary-200 mb-8 max-w-2xl mx-auto">{v("immersion_cta_desc", t("student.desc"))}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/student-immersion"><Button size="lg" variant="secondary">Pelajari Lebih Lanjut</Button></Link>
              <Link href="/contact"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">Hubungi Kami</Button></Link>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Newsletter */}
      <AnimatedSection className="section-padding">
        <div className="container-custom max-w-2xl mx-auto text-center">
          <span className="text-4xl mb-4 block">📬</span>
          <h2 className="text-3xl font-bold mb-4 font-display">{v("newsletter_title", t("newsletter.title"))}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{v("newsletter_subtitle", t("newsletter.subtitle"))}</p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value;
              if (!email) return;
              await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              alert("Terima kasih! Berhasil berlangganan.");
            }}
          >
            <input name="email" type="email" placeholder={v("newsletter_placeholder", t("newsletter.placeholder"))} className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            <Button type="submit" variant="primary">{v("newsletter_cta", t("newsletter.cta"))}</Button>
          </form>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <AnimatedSection className="section-padding bg-slate-50 dark:bg-dark-800/50">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display"><span className="gradient-text">{v("testimonial_title", t("testimonial.title"))}</span></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <div className="flex items-center gap-2 mb-3">{Array.from({ length: testimonial.rating }).map((_, i) => <span key={i} className="text-yellow-400">★</span>)}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-accent-300 flex items-center justify-center text-white font-bold text-sm">{testimonial.name.charAt(0)}</div>
                    <div><p className="font-semibold text-sm">{testimonial.name}</p><p className="text-xs text-slate-500">{testimonial.role}</p></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Partners */}
      <AnimatedSection className="py-12">
        <div className="container-custom text-center">
          <p className="text-sm text-slate-500 mb-6">{v("partners_title", "Didukung oleh")}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {partners.length > 0 ? partners.map((p: string) => (
              <div key={p} className="h-12 w-32 rounded-xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-xs text-slate-400">{p}</div>
            )) : ["Partner 1", "Partner 2", "Partner 3"].map((p) => (
              <div key={p} className="h-12 w-32 rounded-xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-xs text-slate-400">{p}</div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
