import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeParse } from "@/lib/countryUtils";

export async function GET(_request: Request, { params }: { params: { key: string } }) {
  const row = await prisma.setting.findUnique({ where: { key: params.key } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(safeParse(row.value, row.value));
}

export async function PUT(request: Request, { params }: { params: { key: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const value = typeof body === "string" ? body : JSON.stringify(body);

  const setting = await prisma.setting.upsert({
    where: { key: params.key },
    update: { value },
    create: { key: params.key, value },
  });
  return NextResponse.json(safeParse(setting.value, setting.value));
}
