import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { message } = body;

  // Simulate AI response based on keywords
  const responses: Record<string, string> = {
    budget: "Berdasarkan pengalaman saya, budget backpacking bervariasi per negara. Rata-rata saya habiskan Rp 5-15 juta per negara untuk 7-14 hari perjalanan.",
    visa: "Urus visa dari jauh-jauh hari! Saran saya, siapkan dokumen minimal 1 bulan sebelum keberangkatan. Cek halaman Visa Center untuk detail lengkap.",
    safety: "Solo travel aman kok! Yang penting selalu waspada, share lokasi ke keluarga, dan percaya insting. Mulai dari Thailand atau Malaysia untuk pertama kali.",
    food: "Saya selalu cari makanan halal. Tips: cari daerah muslim, tanya local guide, atau masak sendiri di hostel. Eropa juga banyak halal food kok!",
    tips: "Tips utama: packing light, buku catatan, selalu bawa powerbank, dan yang terpenting - buka hati dan pikiran untuk pengalaman baru!",
  };

  const lower = message.toLowerCase();
  let response = "Terima kasih atas pertanyaannya! Berdasarkan pengalaman saya backpacking 21 negara, setiap perjalanan itu unik. Ada hal spesifik yang ingin ditanyakan?";

  for (const [key, value] of Object.entries(responses)) {
    if (lower.includes(key)) {
      response = value;
      break;
    }
  }

  return NextResponse.json({ response, timestamp: new Date().toISOString() });
}
