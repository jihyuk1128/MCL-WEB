import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMinecraftUuid } from "@/lib/mojang";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
  }

  const { nickname } = await req.json();
  if (!nickname) {
    return NextResponse.json({ error: "닉네임을 입력해주세요" }, { status: 400 });
  }

  const uuid = await getMinecraftUuid(nickname);
  if (!uuid) {
    return NextResponse.json({ error: "존재하지 않는 마인크래프트 닉네임이에요" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { minecraftUuid: uuid, minecraftNickname: nickname },
  });

  return NextResponse.json({ ok: true, user: updated });
}
