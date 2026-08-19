import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const entry = await prisma.journalEntry.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { name: true } } },
  });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { images, ...rest } = entry as unknown as Record<string, unknown>;
  return NextResponse.json({
    ...rest,
    images: String(images ?? "").split("\n").map((i) => i.trim()).filter(Boolean),
  });
}
