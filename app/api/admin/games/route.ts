import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 경기 등록 (일정만 먼저 잡을 때)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자만 가능해요" }, { status: 403 });
  }

  const { homeTeamId, awayTeamId, playedAt } = await req.json();
  if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) {
    return NextResponse.json({ error: "팀 선택이 올바르지 않아요" }, { status: 400 });
  }

  const game = await prisma.game.create({
    data: { homeTeamId, awayTeamId, playedAt: new Date(playedAt) },
  });
  return NextResponse.json({ ok: true, game });
}

// 경기 결과 입력/수정 -> 승/패 자동 반영
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자만 가능해요" }, { status: 403 });
  }

  const { gameId, homeScore, awayScore } = await req.json();
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) {
    return NextResponse.json({ error: "경기를 찾을 수 없어요" }, { status: 404 });
  }

  // 기존에 이미 FINISHED였다면, 승패 반영을 되돌린 뒤 다시 반영 (수정 대응)
  if (game.status === "FINISHED" && game.homeScore != null && game.awayScore != null) {
    await revertResult(game.homeTeamId, game.awayTeamId, game.homeScore, game.awayScore);
  }

  const updated = await prisma.game.update({
    where: { id: gameId },
    data: { homeScore, awayScore, status: "FINISHED" },
  });

  await applyResult(game.homeTeamId, game.awayTeamId, homeScore, awayScore);

  return NextResponse.json({ ok: true, game: updated });
}

async function applyResult(homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) {
  if (homeScore === awayScore) {
    await prisma.team.update({ where: { id: homeTeamId }, data: { ties: { increment: 1 } } });
    await prisma.team.update({ where: { id: awayTeamId }, data: { ties: { increment: 1 } } });
  } else if (homeScore > awayScore) {
    await prisma.team.update({ where: { id: homeTeamId }, data: { wins: { increment: 1 } } });
    await prisma.team.update({ where: { id: awayTeamId }, data: { losses: { increment: 1 } } });
  } else {
    await prisma.team.update({ where: { id: awayTeamId }, data: { wins: { increment: 1 } } });
    await prisma.team.update({ where: { id: homeTeamId }, data: { losses: { increment: 1 } } });
  }
}

async function revertResult(homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) {
  if (homeScore === awayScore) {
    await prisma.team.update({ where: { id: homeTeamId }, data: { ties: { decrement: 1 } } });
    await prisma.team.update({ where: { id: awayTeamId }, data: { ties: { decrement: 1 } } });
  } else if (homeScore > awayScore) {
    await prisma.team.update({ where: { id: homeTeamId }, data: { wins: { decrement: 1 } } });
    await prisma.team.update({ where: { id: awayTeamId }, data: { losses: { decrement: 1 } } });
  } else {
    await prisma.team.update({ where: { id: awayTeamId }, data: { wins: { decrement: 1 } } });
    await prisma.team.update({ where: { id: homeTeamId }, data: { losses: { decrement: 1 } } });
  }
}
