import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PredictionCard from "@/components/PredictionCard";

export default async function PredictionsPage() {
  const session = await getServerSession(authOptions);

  const games = await prisma.game.findMany({
    where: { status: "SCHEDULED" },
    include: {
      homeTeam: true,
      awayTeam: true,
      predictions: true,
    },
    orderBy: { playedAt: "asc" },
  });

  return (
    <main className="container">
      <div className="eyebrow">유저 투표</div>
      <h1>경기 예측</h1>
      <p style={{ opacity: 0.6, marginBottom: 24 }}>다가오는 경기의 승자를 예측해보세요</p>

      {games.length === 0 && <div className="card">예정된 경기가 없어요.</div>}

      <div style={{ display: "grid", gap: 16 }}>
        {games.map((g) => {
          const homeVotes = g.predictions.filter((p) => p.predictedWinnerId === g.homeTeamId).length;
          const awayVotes = g.predictions.filter((p) => p.predictedWinnerId === g.awayTeamId).length;
          const myPick = session
            ? g.predictions.find((p) => p.userId === session.user.id)?.predictedWinnerId
            : null;

          return (
            <PredictionCard
              key={g.id}
              gameId={g.id}
              homeTeam={g.homeTeam}
              awayTeam={g.awayTeam}
              homeVotes={homeVotes}
              awayVotes={awayVotes}
              myPick={myPick ?? null}
              loggedIn={!!session}
            />
          );
        })}
      </div>
    </main>
  );
}
