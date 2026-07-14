import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });

  const { gameId, predictedWinnerId } = await req.json();

  const prediction = await prisma.prediction.upsert({
    where: { userId_gameId: { userId: session.user.id, gameId } },
    update: { predictedWinnerId },
    create: { userId: session.user.id, gameId, predictedWinnerId },
  });

  return NextResponse.json({ ok: true, prediction });
}
