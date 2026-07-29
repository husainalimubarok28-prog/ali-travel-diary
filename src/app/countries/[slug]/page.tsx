"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCountryBySlug } from "@/data/countries";

export default function CountryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const country = getCountryBySlug(slug);

  if (!country) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">Negara tidak ditemukan</h1>
          <Link href="/countries"><Button variant="primary">Kembali ke Countries</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-7xl mb-4 block">{country.flag}</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-display">{country.name}</h1>
            <p className="text-xl text-slate-300 max-w-2xl">{country.description}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="glass px-4 py-2 rounded-xl text-white/80 text-sm">⏱️ {country.duration}</span>
              <span className="glass px-4 py-2 rounded-xl text-white/80 text-sm">💰 Rp{(country.budget / 1000000).toFixed(1)} Juta</span>
              <span className="glass px-4 py-2 rounded-xl text-white/80 text-sm">📅 {country.visited}</span>
              <span className="glass px-4 py-2 rounded-xl text-white/80 text-sm">🏙 {country.cities.length} Kota</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom section-padding space-y-16">
        {/* Story */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">{t("country.story")}</h2>
          <Card className="max-w-3xl">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{country.story}</p>
          </Card>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">{t("country.gallery")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center ${i === 1 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <span className="text-4xl opacity-50">📸</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cities */}
        {country.cities.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6 font-display">Kota di {country.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {country.cities.map((city) => (
                <Link key={city.id} href={`/cities/${country.slug}/${city.slug}`}>
                  <Card>
                    <h3 className="font-bold text-lg mb-2">{city.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{city.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {city.highlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          {h}
                        </span>
                      ))}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Transport */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">{t("country.transport")}</h2>
          <div className="flex flex-wrap gap-3">
            {country.transport.map((t, i) => (
              <span key={i} className="glass-card px-4 py-2 text-sm font-medium">{t}</span>
            ))}
          </div>
        </section>

        {/* Visa */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">{t("country.visa")}</h2>
          <Card className="max-w-xl">
            <p className="font-semibold mb-2">{country.visa} {country.visaCost > 0 && `(Rp ${country.visaCost.toLocaleString()})`}</p>
            {country.documents.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Dokumen:</h4>
                <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
                  {country.documents.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}
          </Card>
        </section>

        {/* Budget */}
        {country.budgetBreakdown.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6 font-display">{t("country.budget")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {country.budgetBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between glass-card px-4 py-3">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-primary-600 font-bold">Rp {item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between glass-card px-4 py-3 bg-primary-50 dark:bg-primary-900/20">
                  <span className="font-bold">Total</span>
                  <span className="text-primary-600 font-bold text-lg">
                    Rp {country.budgetBreakdown.reduce((a, b) => a + b.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="aspect-square rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
                <span className="text-4xl">📊 Chart</span>
              </div>
            </div>
          </section>
        )}

        {/* Food */}
        {country.food.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6 font-display">{t("country.food")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {country.food.map((food, i) => (
                <Card key={i}>
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-dark-700 dark:to-dark-800 mb-3 flex items-center justify-center">
                    <span className="text-4xl">🍜</span>
                  </div>
                  <h3 className="font-bold">{food.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{food.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary-600 font-bold">Rp {food.price.toLocaleString()}</span>
                    <span className="text-yellow-500">{'★'.repeat(Math.round(food.rating))}</span>
                  </div>
                  {food.isHalal && <span className="text-xs text-green-600 font-semibold mt-1 inline-block">✅ Halal</span>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Accommodation */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">Accommodation</h2>
          <div className="flex flex-wrap gap-3">
            {country.accommodation.map((a, i) => (
              <span key={i} className="glass-card px-4 py-2 text-sm">{a}</span>
            ))}
          </div>
        </section>

        {/* Internet & SIM */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card>
            <span className="text-3xl mb-2 block">📶</span>
            <h3 className="font-bold mb-1">Internet</h3>
            <p className="text-slate-500">{country.internet}</p>
          </Card>
          <Card>
            <span className="text-3xl mb-2 block">📱</span>
            <h3 className="font-bold mb-1">SIM Card</h3>
            <p className="text-slate-500">{country.simCard}</p>
          </Card>
        </section>

        {/* Safety & Money */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card>
            <span className="text-3xl mb-2 block">🔒</span>
            <h3 className="font-bold mb-1">{t("country.safety")}</h3>
            <p className="text-slate-500">{country.safety}</p>
          </Card>
          <Card>
            <span className="text-3xl mb-2 block">💵</span>
            <h3 className="font-bold mb-1">Money</h3>
            <p className="text-slate-500">{country.money}</p>
          </Card>
        </section>

        {/* Mosque & Halal Food */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card>
            <span className="text-3xl mb-2 block">🕌</span>
            <h3 className="font-bold mb-1">Masjid</h3>
            <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
              {country.mosque.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </Card>
          <Card>
            <span className="text-3xl mb-2 block">🥙</span>
            <h3 className="font-bold mb-1">Halal Food</h3>
            <p className="text-slate-500">{country.halalFood}</p>
          </Card>
        </section>

        {/* Best & Worst Experience */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <span className="text-3xl mb-2 block">🌟</span>
            <h3 className="font-bold mb-1">Best Experience</h3>
            <p className="text-slate-500">{country.bestExperience}</p>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <span className="text-3xl mb-2 block">😅</span>
            <h3 className="font-bold mb-1">Worst Experience</h3>
            <p className="text-slate-500">{country.worstExperience}</p>
          </Card>
        </section>

        {/* Travel Tips */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">{t("country.tips")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {country.travelTips.map((tip, i) => (
              <Card key={i} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <p className="text-slate-600 dark:text-slate-400">{tip}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Hidden Gems */}
        {country.hiddenGems.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6 font-display">💎 Hidden Gems</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {country.hiddenGems.map((gem, i) => (
                <Card key={i} className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">💎</span>
                  <p className="text-slate-600 dark:text-slate-400">{gem}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Ratings */}
        <section>
          <h2 className="text-3xl font-bold mb-6 font-display">Rating</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(country.ratings).map(([key, value]) => (
              <Card key={key} className="text-center">
                <div className="text-lg font-bold gradient-text">{value}/5</div>
                <div className="text-xs text-slate-500 capitalize">{key}</div>
                <div className="w-full bg-slate-200 dark:bg-dark-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-full h-2" style={{ width: `${(value / 5) * 100}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="flex flex-wrap gap-4 justify-center">
          <Link href={`/budget/${country.slug}`}><Button variant="primary" size="lg">💰 Lihat Budget Detail</Button></Link>
          <Link href="/world-map"><Button variant="outline" size="lg">🗺️ Kembali ke Peta</Button></Link>
          <Link href="/countries"><Button variant="outline" size="lg">🌍 Semua Negara</Button></Link>
        </section>
      </div>
    </div>
  );
}
