"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AIMessage } from "@/types";

const suggestions = [
  "Budget Mesir 7 hari?",
  "Hostel terbaik Bangkok?",
  "Aman nggak solo travel?",
  "Visa Schengen susah nggak?",
  "Tips backpacking pertama?",
  "Makanan halal di Eropa?",
];

const sampleResponses: Record<string, string> = {
  "budget mesir 7 hari?": "Untuk 7 hari di Mesir dengan budget backpacker:\n\n🏨 Hostel: Rp120.000/malam x 7 = Rp840.000\n🚇 Transportasi: Rp5.000-20.000/hari\n🍜 Makan: Rp25.000-50.000/hari\n🎫 Tiket Masuk: Piramida ~Rp300.000\n📱 SIM Card: Rp100.000\n\nTotal estimasi: Rp3-5 juta sudah cukup nyaman!",
  "hostel terbaik bangkok?": "Hostel rekomendasi di Bangkok:\n\n1. Bed Station Hostel - Mulai Rp150.000/malam, lokasi dekat Khao San Road\n2. Boxpackers Hostel - Modern, kolam renang, mulai Rp200.000\n3. Lub d Bangkok - Co-working space, bersih, mulai Rp180.000\n\nTips: Booking via Hostelworld atau Agoda untuk harga terbaik!",
  "aman nggak solo travel?": "Solo travel aman kok, asal:\n\n✅ Selalu share lokasi ke keluarga\n✅ Pilih akomodasi di area ramai\n✅ Simpan scan passport di cloud\n✅ Download map offline\n✅ Pelajari 3-5 kata lokal\n✅ Percaya insting\n\nNegara yang recommended untuk first-time solo: Thailand, Malaysia, Nepal!",
};

export default function AIAskAliPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Halo! Saya Ali AI. Tanya apa aja tentang traveling, berdasarkan pengalaman saya backpacking 21 negara. ✈️",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Maaf, saya belum bisa menjawab pertanyaan itu. Coba tanya yang lain!",
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-purple-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🤖</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{t("ai.title")}</h1>
            <p className="text-xl text-slate-300">{t("ai.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Chat */}
          <Card className="p-0 overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-slate-50 dark:bg-dark-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🤖</span>
                        <span className="font-semibold text-sm">Ali AI</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 dark:bg-dark-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <span className="text-sm text-slate-500">{t("ai.loading")}</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 dark:border-dark-700 p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("ai.placeholder")}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button type="submit" variant="primary" loading={loading} disabled={loading || !input.trim()}>
                  {t("ai.send")}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
