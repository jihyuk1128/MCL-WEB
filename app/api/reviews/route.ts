import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });

  const { title, content, gameId } = await req.json();
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "제목과 내용을 입력해주세요" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: { userId: session.user.id, title, content, gameId: gameId || null },
  });

  return NextResponse.json({ ok: true, review });
}
