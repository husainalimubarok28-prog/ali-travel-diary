"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">✈️</span>
              <h1 className="text-2xl font-bold font-display">Buat Akun Baru</h1>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <input type="text" placeholder="Nama Lengkap" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <input type="password" placeholder="Konfirmasi Password" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <Button type="submit" variant="primary" className="w-full">Daftar</Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-primary-600 hover:underline">Masuk</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
