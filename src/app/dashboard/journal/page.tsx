"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardJournalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/journal").then(r => r.json()).then(setEntries);
  }, []);

  if (status === "unauthenticated") return null;

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-teal-900">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Journal</h1>
              <p className="text-slate-300">Travel Journal entries ({entries.length})</p>
            </div>
            <Button variant="primary">+ New Entry</Button>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <Card className="p-12 text-center text-slate-500">
            <span className="text-4xl block mb-4">📓</span>
            <p>Journal management dengan CRUD akan segera hadir.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
