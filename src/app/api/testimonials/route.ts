import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.testimonial.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const maxOrder = await prisma.testimonial.aggregate({ _max: { displayOrder: true } });
  const item = await prisma.testimonial.create({
    data: {
      name: body.name,
      role: body.role || "",
      avatar: body.avatar || "",
      content: body.content,
      rating: body.rating || 5,
      displayOrder: body.displayOrder ?? (maxOrder._max.displayOrder ?? 0) + 1,
    },
  });
  return NextResponse.json(item);
}
