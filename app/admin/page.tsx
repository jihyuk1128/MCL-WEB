import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/");

  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  const games = await prisma.game.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { playedAt: "desc" },
    take: 30,
  });

  return (
    <main className="container">
      <div className="eyebrow">관리자 전용</div>
      <h1>리그 관리</h1>
      <AdminPanel teams={teams} games={games as any} />
    </main>
  );
}
