"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";

interface FaqItem {
  question: string;
  answer: string;
}

export default function StudentImmersionPage() {
  const { data: faqStudentImmersion, loading } = useFetch<FaqItem[]>("/api/settings/faqImmersion", []);

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-teal-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🎓</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Student Immersion</h1>
            <p className="text-xl text-slate-300">Belajar sambil traveling, mengajar sambil berpetualang</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom space-y-16">
          {/* Program Overview */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-display">Apa itu Student Immersion?</h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>Program yang menggabungkan pengajaran dan traveling. Kami mengajar di sekolah-sekolah lokal di berbagai negara sambil menjelajahi budaya setempat.</p>
                <p>Program ini cocok untuk mahasiswa dan fresh graduate yang ingin memiliki pengalaman internasional sambil berkontribusi pada komunitas global.</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/contact"><Button variant="primary">Daftar Sekarang</Button></Link>
                <Button variant="outline">📥 Download Proposal</Button>
              </div>
            </div>
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-teal-100 to-primary-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
              <span className="text-6xl">🎓</span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center font-display">Program Timeline</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Pendaftaran", desc: "Isi form dan submit CV", icon: "📝" },
                { step: "02", title: "Seleksi", desc: "Wawancara & assessment", icon: "🎯" },
                { step: "03", title: "Persiapan", desc: "Training & briefing", icon: "📚" },
                { step: "04", title: "Berangkat!", desc: "Mulai petualangan!", icon: "✈️" },
              ].map((item) => (
                <Card key={item.step} className="text-center">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <span className="text-sm text-primary-600 font-bold">{item.step}</span>
                  <h4 className="font-bold mt-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center font-display">FAQ</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
              </div>
            ) : faqStudentImmersion.length === 0 ? (
              <p className="text-center text-slate-500">Belum ada FAQ.</p>
            ) : (
              <div className="max-w-2xl mx-auto space-y-4">
                {faqStudentImmersion.map((faq, i) => (
                  <Card key={i}>
                    <h3 className="font-bold mb-2">{faq.question}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center font-display">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-teal-100 to-primary-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <span className="text-5xl block mb-4">🚀</span>
            <h2 className="text-3xl font-bold mb-4 font-display">Siap Bergabung?</h2>
            <p className="text-slate-500 mb-6 max-w-lg mx-auto">Jadilah bagian dari program Student Immersion dan dapatkan pengalaman yang tak terlupakan</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact"><Button variant="primary" size="lg">Daftar Sekarang</Button></Link>
              <Button variant="outline" size="lg">📥 Download Proposal PDF</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
