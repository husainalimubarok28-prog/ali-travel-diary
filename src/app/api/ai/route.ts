import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { message } = body;
  const lower = message.toLowerCase();

  const responses: Record<string, string> = {
    budget: "Berdasarkan pengalaman saya backpacking 21 negara, budget sangat bervariasi:\n\n🌏 Asia Tenggara: Rp3-5 juta/7hari\n🌍 Timur Tengah: Rp5-8 juta/7hari\n🌎 Eropa: Rp8-15 juta/7hari\n\nTips hemat:\n- Gunakan hostel dorms\n- Masak sendiri di hostel\n- Manfaatkan transportasi umum\n- Cari free walking tour\n\nNegara termurah? Thailand, Vietnam, dan Nepal!",
    visa: "Tips visa dari pengalaman saya:\n\n📌 Schengen: Urus minimal 1-2 bulan sebelumnya\n📌 Turki: E-visa online, 5 menit jadi\n📌 Mesir: Visa on arrival $25\n📌 Malaysia/Singapura: Gratis untuk WNI\n📌 Nepal: Visa on arrival\n\nSiapkan: paspor (min 6 bulan), tiket PP, booking hotel, asuransi perjalanan, rekening koran 3 bulan terakhir.",
    safety: "Solo travel aman! Tips dari pengalaman:\n\n✅ Share lokasi real-time ke keluarga via WhatsApp\n✅ Pilih hostel di area ramai dengan rating 8+\n✅ Simpan scan paspor di Google Drive\n✅ Download Google Maps offline\n✅ Pelajari 3 kata lokal: 'tolong', 'terima kasih', 'berapa harganya?'\n✅ Percaya insting - kalau merasa nggak aman, pergi!\n\nRekomendasi negara pertama: Thailand, Malaysia, Vietnam!",
    food: "Makanan halal saat traveling:\n\n🥘 Asia Tenggara: Mudah - banyak warung makan muslim\n🥙 Timur Tengah: Sangat mudah - makanan halal dimana-mana\n🥗 Eropa: Cari \"halal food\" di Google Maps, atau masak sendiri\n🍜 Tips: Bawa indomie sachet, rice cooker kecil\n\nNegara dengan makanan halal terbaik: Malaysia, Turki, Maroko!",
    tips: "Tips utama backpacking:\n\n1. 🎒 Bawa <15kg - backpack 40-60L cukup\n2. 📱 Aplikasi wajib: Google Maps, Grab/Gojek, Hostelworld, XE Currency\n3. 💰 Bawa $200-500 cash USD + kartu debit internasional\n4. 🏨 Booking hostel 1-2 hari sebelumnya\n5. 📸 Abadikan momen - tapi jangan lupa nikmati saat ini juga!\n6. 🤝 Berteman dengan traveler lain di hostel\n7. 📝 Catat pengalaman setiap hari\n\nYang paling penting: BUKA HATI dan PIKIRAN untuk pengalaman baru!",
  };

  for (const [key, value] of Object.entries(responses)) {
    if (lower.includes(key)) {
      return NextResponse.json({ response: value, timestamp: new Date().toISOString() });
    }
  }

  if (lower.includes("mesir") || lower.includes("egypt") || lower.includes("piramida")) {
    return NextResponse.json({
      response: "Mesir adalah salah satu negara favorit saya!\n\n📍 Piramida Giza - Wajib dikunjungi, datang pagi-pagi (07:00) untuk hindari keramaian\n📍 Museum Mesir - Tiket Rp100rb, lihat harta karun Tutankhamun\n📍 Khan El Khalili - Pasar tradisional, jangan lupa tawar-menawar!\n📍 Nile Cruise - Nikmati sunset di Sungai Nil\n📍 Biaya: sekitar Rp8-10 juta untuk 14 hari\n\nTips: Hati-hati dengan scammers di area wisata, selalu tanya harga dulu!",
      timestamp: new Date().toISOString()
    });
  }

  if (lower.includes("turki") || lower.includes("turkey") || lower.includes("istanbul")) {
    return NextResponse.json({
      response: "Turki negara yang amazing!\n\n📍 Istanbul: Hagia Sophia, Blue Mosque, Grand Bazaar\n📍 Cappadocia: Balloon ride saat sunrise ($150-200)\n📍 Pamukkale: Kolam travertine alami\n📍 Antalya: Pantai dan kota tua yang cantik\n📍 Budget: Rp8-12 juta untuk 10 hari\n\nKuliner: Kebab, Baklava, Turkish Tea wajib dicoba!",
      timestamp: new Date().toISOString()
    });
  }

  if (lower.includes("jepang") || lower.includes("japan") || lower.includes("tokyo")) {
    return NextResponse.json({
      response: "Jepang! Negara impian banyak orang:\n\n📍 Tokyo: Shibuya, Shinjuku, Akihabara, Asakusa\n📍 Kyoto: Fushimi Inari, Kinkaku-ji, Arashiyama\n📍 Osaka: Dotonbori, Universal Studios\n📍 Budget: Rp15-20 juta untuk 10 hari (lebih mahal)\n\nTips: JR Pass worth it kalau traveling antar kota. Coba onigiri dan ramen di konbini!",
      timestamp: new Date().toISOString()
    });
  }

  return NextResponse.json({
    response: `Terima kasih pertanyaannya tentang "${message}"!\n\nDari pengalaman saya backpacking ke 21 negara, yang paling penting adalah:\n\n1. 🎯 Persiapan mateng - riset negara tujuan\n2. 💰 Atur budget dengan baik\n3. 🤝 Jangan sungkan minta bantuan\n4. 📸 Dokumentasikan setiap momen\n5. 💪 Trust the process!\n\nAda yang ingin ditanyakan lagi? Saya siap membantu! 😊`,
    timestamp: new Date().toISOString()
  });
}
