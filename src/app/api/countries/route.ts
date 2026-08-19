import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCity, parseCountry, serializeCountry } from "@/lib/countryUtils";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const continent = searchParams.get("continent");

  const where: Record<string, unknown> = {};
  if (continent && continent !== "all") where.continent = continent;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { nameId: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const rows = await prisma.countryData.findMany({
    where,
    orderBy: { displayOrder: "asc" },
  });

  const cities = await prisma.city.findMany();
  const cityMap = new Map<string, typeof cities>();
  for (const city of cities) {
    const list = cityMap.get(city.countrySlug) || [];
    list.push(city);
    cityMap.set(city.countrySlug, list);
  }

  const countries = rows.map((row) => {
    const country = parseCountry(row);
    country.cities = (cityMap.get(row.slug) || []).map((city) => parseCity(city));
    return country;
  });

  return NextResponse.json(countries);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = serializeCountry(body);
    if (!body.slug) data.slug = slugify(body.name || "");
    if (!data.nameId) data.nameId = body.name || "";

    const item = await prisma.countryData.create({ data: data as never });
    return NextResponse.json(parseCountry(item));
  } catch (error) {
    console.error("Create country error:", error);
    return NextResponse.json({ error: "Gagal membuat negara" }, { status: 500 });
  }
}
