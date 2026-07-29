import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = {};
  if (category && category !== "all") where.category = category;

  const posts = await prisma.blogPost.findMany({
    where,
    include: { author: { select: { name: true, avatar: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, excerpt, coverImage, category, tags, published, featured } = body;

    const slug = slugify(title) + "-" + Date.now().toString(36);

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: content || "",
        excerpt: excerpt || title.slice(0, 150),
        coverImage: coverImage || "",
        category: category || "travel-story",
        tags: tags || "",
        published: published || false,
        featured: featured || false,
        readingTime: Math.ceil((content || "").split(/\s+/).length / 200),
        authorId: (session.user as unknown as Record<string, unknown>).id as string,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Gagal membuat post" }, { status: 500 });
  }
}
