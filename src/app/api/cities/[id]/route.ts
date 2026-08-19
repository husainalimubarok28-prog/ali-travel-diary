import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCity } from "@/lib/countryUtils";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const row =
    (await prisma.city.findUnique({ where: { id: params.id } })) ||
    (await prisma.city.findFirst({ where: { slug: params.id } }));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(parseCity(row));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const item = await prisma.city.update({ where: { id: params.id }, data: body });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.city.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
