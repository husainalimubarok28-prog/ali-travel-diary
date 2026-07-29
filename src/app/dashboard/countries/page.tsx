"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { countries } from "@/data/countries";

export default function DashboardCountriesPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-blue-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Countries</h1>
              <p className="text-slate-300">Kelola data negara</p>
            </div>
            <Button variant="primary">+ Tambah Negara</Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-4">
            {countries.map((country) => (
              <Card key={country.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold">{country.name}</h3>
                    <p className="text-xs text-slate-500">{country.continent} • {country.cities.length} cities</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">✏️</Button>
                  <Button variant="ghost" size="sm">👁️</Button>
                  <Button variant="ghost" size="sm" className="text-red-500">🗑️</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
