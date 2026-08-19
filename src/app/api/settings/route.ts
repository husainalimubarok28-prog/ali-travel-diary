import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeParse } from "@/lib/countryUtils";

export async function GET() {
  const rows = await prisma.setting.findMany();
  const settings: Record<string, unknown> = {};
  for (const row of rows) {
    settings[row.key] = safeParse(row.value, row.value);
  }
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const value = typeof body.value === "string" ? body.value : JSON.stringify(body.value);
  const setting = await prisma.setting.upsert({
    where: { key: body.key },
    update: { value },
    create: { key: body.key, value },
  });
  return NextResponse.json(setting);
}
