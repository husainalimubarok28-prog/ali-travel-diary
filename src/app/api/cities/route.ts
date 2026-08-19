import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCity } from "@/lib/countryUtils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countrySlug = searchParams.get("countrySlug");

  const where = countrySlug ? { countrySlug } : {};
  const items = await prisma.city.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(items.map((item) => parseCity(item)));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-");
  const item = await prisma.city.create({
    data: { ...body, slug },
  });
  return NextResponse.json(item);
}
