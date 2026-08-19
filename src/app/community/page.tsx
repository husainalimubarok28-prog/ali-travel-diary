"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMS } from "@/hooks/useCMS";

const members = [
  { name: "Rina Wijaya", country: "Thailand", bio: "Backpacker pemula yang terinspirasi dari Ali", avatar: "RW" },
  { name: "Ahmad Fauzi", country: "Turki", bio: "Peserta Student Immersion 2025", avatar: "AF" },
  { name: "Siti Nurhaliza", country: "Nepal", bio: "Solo traveler muslimah", avatar: "SN" },
  { name: "Budi Santoso", country: "Vietnam", bio: "Travel blogger", avatar: "BS" },
];

export default function CommunityPage() {
  const { get } = useCMS("community");
  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-pink-900" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">👥</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">{get("community_title", "Komunitas")}</h1>
            <p className="text-xl text-slate-300">{get("community_subtitle", "Bergabung dengan sesama backpacker Indonesia")}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom space-y-12">
          {/* Members */}
          <div>
            <h2 className="text-2xl font-bold mb-6 font-display">Member</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                      {member.avatar}
                    </div>
                    <h3 className="font-bold">{member.name}</h3>
                    <span className="text-xs text-primary-600">✈️ {member.country}</span>
                    <p className="text-sm text-slate-500 mt-2">{member.bio}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Forum placeholder */}
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <span className="text-4xl mb-3 block">💬</span>
              <h3 className="font-bold text-lg mb-2">Forum Komunitas</h3>
              <p className="text-sm text-slate-500 mb-4">Forum diskusi akan hadir di fase pengembangan berikutnya.</p>
              <Button variant="outline" size="sm">Bergabung di WhatsApp</Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
