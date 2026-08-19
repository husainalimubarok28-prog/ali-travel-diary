"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import type { Country } from "@/types";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function CountryPopup({ country, onClose }: { country: Country; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="glass-card p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{country.flag}</span>
          <div>
            <h3 className="text-xl font-bold">{country.name}</h3>
            <p className="text-sm text-slate-500">{country.continent}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg">&times;</button>
      </div>

      <div className="space-y-4">
        <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center">
          <span className="text-4xl">📸</span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">{country.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="glass rounded-lg p-2 text-center">
            <span className="block text-lg">📅</span>
            <span className="text-xs text-slate-500">{country.visited}</span>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <span className="block text-lg">⏱️</span>
            <span className="text-xs text-slate-500">{country.duration}</span>
          </div>
          <div className="glass rounded-lg p-2 text-center col-span-2">
            <span className="block text-lg">💰</span>
            <span className="text-xs text-slate-500">Budget: Rp {(country.budget / 1000000).toFixed(1)} Juta</span>
          </div>
        </div>

        {country.food.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">🍜 Makanan</h4>
            <div className="space-y-2">
              {country.food.map((food, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-dark-800 rounded-lg p-2">
                  <span>{food.name}</span>
                  <span className="text-primary-600 font-semibold">Rp {food.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {country.budgetBreakdown.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">💰 Budget</h4>
            <div className="space-y-2">
              {country.budgetBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-dark-800 rounded-lg p-2">
                  <span>{item.category}</span>
                  <span className="font-semibold">Rp {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/countries/${country.slug}`} className="flex-1">
            <Button variant="primary" className="w-full">Lihat Detail</Button>
          </Link>
          <Link href={`/budget/${country.slug}`}>
            <Button variant="outline">💰 Budget</Button>
          </Link>
        </div>

        {country.travelTips.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">💡 Tips</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
              {country.travelTips.slice(0, 3).map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const countryCoords: Record<string, [number, number]> = {
  "Indonesia": [106.8, -6.2],
  "Malaysia": [101.7, 3.1],
  "Singapore": [103.8, 1.3],
  "Thailand": [100.5, 13.7],
  "Vietnam": [105.8, 21.0],
  "Cambodia": [104.9, 11.5],
  "Myanmar": [96.1, 16.8],
  "Laos": [102.6, 17.9],
  "Philippines": [121.0, 14.5],
  "Brunei": [114.9, 4.9],
  "Japan": [139.7, 35.7],
  "South Korea": [126.9, 37.5],
  "China": [116.4, 39.9],
  "Taiwan": [121.5, 25.0],
  "Hong Kong": [114.1, 22.3],
  "Macau": [113.5, 22.2],
  "India": [77.2, 28.6],
  "Nepal": [85.3, 27.7],
  "Sri Lanka": [79.8, 6.9],
  "Bangladesh": [90.4, 23.7],
  "Maldives": [73.5, 4.1],
  "Egypt": [31.2, 30.0],
  "Turkey": [32.8, 39.9],
  "United Arab Emirates": [55.3, 25.2],
  "Saudi Arabia": [46.7, 24.7],
  "Qatar": [51.5, 25.2],
  "Oman": [58.5, 23.5],
  "Jordan": [35.9, 31.9],
  "Iran": [51.4, 35.7],
  "Australia": [149.1, -35.3],
  "United Kingdom": [-0.1, 51.5],
  "France": [2.3, 48.8],
  "Netherlands": [4.9, 52.3],
  "Germany": [13.4, 52.5],
  "Italy": [12.5, 41.9],
  "Spain": [-3.7, 40.4],
};

export default function WorldMapPage() {
  const { t } = useLanguage();
  const { data: countries, loading } = useFetch<Country[]>("/api/countries", []);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [tooltip, setTooltip] = useState("");

  const continents = ["all", ...Array.from(new Set(countries.map((c) => c.continent)))];
  const filteredCountries = filter === "all" ? countries : countries.filter((c) => c.continent === filter);

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">🗺️</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
              {t("map.title")}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">{t("map.desc")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* Interactive SVG Map */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-800 dark:to-dark-900 mb-8 shadow-lg">
            <ComposableMap
              projectionConfig={{ scale: 150 }}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup zoom={1} maxZoom={4}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const isVisited = countries.some(
                        (c) => geo.properties?.name?.toLowerCase().includes(c.name.toLowerCase()) ||
                               c.name.toLowerCase().includes(geo.properties?.name?.toLowerCase())
                      );
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isVisited ? "#3b82f6" : "#e2e8f0"}
                          stroke="#fff"
                          strokeWidth={0.5}
                          className="transition-colors duration-200"
                          style={{
                            default: { fill: isVisited ? "#3b82f6" : "#e2e8f0", outline: "none" },
                            hover: { fill: isVisited ? "#2563eb" : "#cbd5e1", outline: "none", cursor: "pointer" },
                            pressed: { fill: isVisited ? "#1d4ed8" : "#94a3b8", outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
                {filteredCountries.map((country) => {
                  const coords = countryCoords[country.name];
                  if (!coords) return null;
                  return (
                    <Marker key={country.id} coordinates={coords}>
                      <g
                        onClick={() => setSelectedCountry(country)}
                        onMouseEnter={() => setTooltip(country.name)}
                        onMouseLeave={() => setTooltip("")}
                        style={{ cursor: "pointer" }}
                      >
                        <circle r={8} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
                        <text
                          textAnchor="middle"
                          y={-14}
                          fontSize={12}
                          fill="#374151"
                          className="dark:fill-slate-200"
                        >
                          {country.flag}
                        </text>
                      </g>
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>
            {/* Tooltip */}
            {tooltip && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-dark-800 px-4 py-2 rounded-xl shadow-lg text-sm font-medium z-10">
                {tooltip}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === c
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-700"
                }`}
              >
                {c === "all" ? "Semua" : c}
              </button>
            ))}
          </div>

          {/* Country Grid */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredCountries.map((country, index) => (
                <motion.button
                  key={country.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCountry(country)}
                  className="glass-card p-4 text-center hover-lift group"
                >
                  <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{country.flag}</span>
                  <h3 className="font-semibold text-sm">{country.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{country.continent}</p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedCountry(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <CountryPopup country={selectedCountry} onClose={() => setSelectedCountry(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
