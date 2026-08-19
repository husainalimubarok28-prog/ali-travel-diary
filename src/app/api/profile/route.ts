import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { email: (session.user as any).email },
    select: { id: true, name: true, email: true, avatar: true, role: true },
  });
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const user = await prisma.user.update({
    where: { email: (session.user as any).email },
    data: { name: body.name, avatar: body.avatar },
  });
  return NextResponse.json({ name: user.name, avatar: user.avatar });
}
