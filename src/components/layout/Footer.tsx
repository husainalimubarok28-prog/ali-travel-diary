"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const footerLinks = [
  {
    title: "Jelajahi",
    links: [
      { href: "/countries", label: "Negara" },
      { href: "/world-map", label: "Peta Interaktif" },
      { href: "/timeline", label: "Timeline" },
      { href: "/blog", label: "Blog" },
      { href: "/gallery", label: "Galeri" },
    ],
  },
  {
    title: "Fitur",
    links: [
      { href: "/ai-ask-ali", label: "AI Ask Ali" },
      { href: "/calculator", label: "Budget Calculator" },
      { href: "/checklist", label: "Backpacking Checklist" },
      { href: "/packing-generator", label: "Packing Generator" },
      { href: "/visa", label: "Visa Center" },
    ],
  },
  {
    title: "Program",
    links: [
      { href: "/student-immersion", label: "Student Immersion" },
      { href: "/resources", label: "Travel Resources" },
      { href: "/community", label: "Komunitas" },
      { href: "/statistics", label: "Statistik" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
  {
    title: "Kontak",
    links: [
      { href: "/contact", label: "Hubungi Ali" },
      { href: "https://wa.me/6282342023235", label: "WhatsApp" },
      { href: "https://www.instagram.com/ali.traveldiary", label: "Instagram" },
      { href: "https://www.tiktok.com/@ali.traveldiary", label: "TikTok" },
      { href: "https://www.youtube.com/@husainalimubarok", label: "YouTube" },
    ],
  },
];

export function Footer() {
  const { t } = useLanguage();
  const [footerTagline, setFooterTagline] = useState("");

  useEffect(() => {
    fetch("/api/cms").then(r => r.json()).then(data => {
      for (const cat of Object.values(data)) {
        const found = (cat as any[]).find((c: any) => c.key === "footer_tagline");
        if (found) { setFooterTagline(found.value); break; }
      }
    }).catch(() => {});
  }, []);

  return (
    <footer className="relative bg-dark-900 text-slate-300 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container-custom relative py-16">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12 text-center">
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white">21</div>
            <div className="text-xs text-slate-400">Negara</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white">25+</div>
            <div className="text-xs text-slate-400">Kota</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white">8.000+</div>
            <div className="text-xs text-slate-400">Foto & Video</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white">50.000+</div>
            <div className="text-xs text-slate-400">Kilometer</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white">200+</div>
            <div className="text-xs text-slate-400">Kuliner</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white">Rp200jt+</div>
            <div className="text-xs text-slate-400">Biaya Total</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-white mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-lg text-white">Ali Travel Diary</span>
          </div>

          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Ali Travel Diary. {t("footer.rights")}.
            <br className="md:hidden" /> {t("footer.made")}
          </p>
          {footerTagline && (
            <p className="text-xs text-slate-600 text-center mt-1">{footerTagline}</p>
          )}

          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/ali.traveldiary" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <span className="text-lg">📸</span>
            </a>
            <a href="https://www.tiktok.com/@ali.traveldiary" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <span className="text-lg">🎵</span>
            </a>
            <a href="https://www.youtube.com/@husainalimubarok" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <span className="text-lg">▶️</span>
            </a>
            <a href="https://wa.me/6282342023235" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <span className="text-lg">💬</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
