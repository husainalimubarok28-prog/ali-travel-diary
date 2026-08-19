import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCity, parseCountry, serializeCountry } from "@/lib/countryUtils";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const row =
    (await prisma.countryData.findUnique({ where: { id: params.id } })) ||
    (await prisma.countryData.findFirst({ where: { slug: params.id } }));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const cities = await prisma.city.findMany({ where: { countrySlug: row.slug } });
  const country = parseCountry(row);
  country.cities = cities.map((city) => parseCity(city));

  return NextResponse.json(country);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = serializeCountry(body);
    const item = await prisma.countryData.update({
      where: { id: params.id },
      data: data as never,
    });
    return NextResponse.json(parseCountry(item));
  } catch (error) {
    console.error("Update country error:", error);
    return NextResponse.json({ error: "Gagal mengupdate negara" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.countryData.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
