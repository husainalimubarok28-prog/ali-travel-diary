import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
  }

  // Simulate storing subscriber
  return NextResponse.json({
    success: true,
    message: "Terima kasih! Kamu berhasil berlangganan newsletter Ali Travel Diary.",
    email,
    subscribedAt: new Date().toISOString(),
  });
}
