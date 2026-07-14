import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자만 가능해요" }, { status: 403 });
  }

  const { email, makeAdmin } = await req.json();
  const target = await prisma.user.update({
    where: { email },
    data: { role: makeAdmin ? "ADMIN" : "USER" },
  });

  return NextResponse.json({ ok: true, user: target });
}
