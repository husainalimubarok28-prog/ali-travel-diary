"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

const contacts = [
  { icon: "💬", label: "WhatsApp", value: "+62 82 342023235", href: "https://wa.me/6282342023235" },
  { icon: "📧", label: "Email", value: "husainalimubarok28@gmail.com", href: "mailto:husainalimubarok28@gmail.com" },
  { icon: "📸", label: "Instagram", value: "@ali.traveldiary", href: "https://www.instagram.com/ali.traveldiary" },
  { icon: "🎵", label: "TikTok", value: "@ali.traveldiary", href: "https://www.tiktok.com/@ali.traveldiary" },
  { icon: "▶️", label: "YouTube", value: "Husain Ali Mubarok", href: "https://www.youtube.com/@husainalimubarok" },
];

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-cyan-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">📞</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{t("contact.title")}</h1>
            <p className="text-xl text-slate-300">Mari terhubung! Ada pertanyaan atau ingin kolaborasi?</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <a href={contact.href} target="_blank" rel="noopener noreferrer">
                    <Card className="flex items-center gap-4 hover-lift">
                      <span className="text-3xl">{contact.icon}</span>
                      <div>
                        <h3 className="font-semibold">{contact.label}</h3>
                        <p className="text-sm text-primary-600">{contact.value}</p>
                      </div>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-6 font-display">Kirim Pesan</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nama"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Pesan..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Kirim Pesan ✈️
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
