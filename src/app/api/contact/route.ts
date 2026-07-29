import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Pesan berhasil dikirim! Ali akan membalas secepatnya.",
  });
}
