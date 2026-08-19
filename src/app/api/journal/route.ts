import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export async function GET() {
  const entries = await prisma.journalEntry.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(
    entries.map(({ images, ...rest }) => ({
      ...rest,
      images: String(images ?? "").split("\n").map((i) => i.trim()).filter(Boolean),
    }))
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const slug = slugify(body.title) + "-" + Date.now().toString(36);

  const entry = await prisma.journalEntry.create({
    data: {
      ...body,
      slug,
      authorId: (session.user as unknown as Record<string, unknown>).id as string,
    },
  });

  return NextResponse.json(entry);
}
