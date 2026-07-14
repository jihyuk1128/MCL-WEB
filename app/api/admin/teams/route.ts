import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자만 가능해요" }, { status: 403 });
  }

  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "팀 이름을 입력해주세요" }, { status: 400 });
  }

  const team = await prisma.team.create({ data: { name: name.trim() } });
  return NextResponse.json({ ok: true, team });
}

export async function GET() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ teams });
}
