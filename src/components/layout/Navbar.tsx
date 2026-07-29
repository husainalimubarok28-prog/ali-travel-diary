"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/world-map", labelKey: "nav.map" },
  { href: "/timeline", labelKey: "nav.timeline" },
  { href: "/countries", labelKey: "nav.countries" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/gallery", labelKey: "nav.gallery" },
  { href: "/contact", labelKey: "nav.contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages: Language[] = ["id", "en", "ar"];
  const langFlags: Record<Language, string> = { id: "🇮🇩", en: "🇬🇧", ar: "🇸🇦" };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="container-custom flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">✈️</span>
          <span className={cn("gradient-text", scrolled ? "" : "text-white")}>
            Ali Travel Diary
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                scrolled
                  ? "text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-dark-800"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-dark-800 rounded-lg p-0.5">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "px-2 py-1 rounded-md text-xs font-medium transition-all",
                  language === lang
                    ? "bg-white dark:bg-dark-700 shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-dark-700/50"
                )}
              >
                {langFlags[lang]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "auto" : "dark")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              scrolled
                ? "hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-400"
                : "text-white/80 hover:text-white hover:bg-white/10"
            )}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? "☀️" : "🌙"}
          </button>

          <Link
            href="/search"
            className={cn(
              "p-2 rounded-lg transition-colors",
              scrolled
                ? "hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-400"
                : "text-white/80 hover:text-white hover:bg-white/10"
            )}
          >
            🔍
          </Link>

          <Link
            href="/ai-ask-ali"
            className="hidden md:inline-flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            🤖 AI
          </Link>

          {session ? (
            <>
              <Link href="/dashboard"
                className={cn("p-2 rounded-lg transition-colors", scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10")}>
                📊
              </Link>
              <button onClick={() => signOut()}
                className={cn("p-2 rounded-lg transition-colors", scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10")}>
                🚪
              </button>
            </>
          ) : (
            <Link href="/auth/login"
              className={cn("p-2 rounded-lg transition-colors", scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10")}>
              🔑
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg",
              scrolled ? "text-slate-600 dark:text-slate-400" : "text-white"
            )}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-slate-200/50 dark:border-dark-700/50 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-1">
              {[...navLinks, { href: "/ai-ask-ali", labelKey: "nav.ai" }, { href: "/journal", labelKey: "nav.journal" }, { href: "/video", labelKey: "nav.video" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-primary-600"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 pt-3 border-t border-slate-200 dark:border-dark-700">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium",
                      language === lang ? "bg-primary-100 dark:bg-primary-900 text-primary-700" : "text-slate-500"
                    )}
                  >
                    {langFlags[lang]} {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
