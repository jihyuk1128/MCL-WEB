import { prisma } from "@/lib/prisma";

function calcGB(topWins: number, topLosses: number, wins: number, losses: number) {
  return ((topWins - wins) + (losses - topLosses)) / 2;
}

export default async function StandingsPage() {
  const teams = await prisma.team.findMany();

  const ranked = teams
    .map((t) => ({
      ...t,
      games: t.wins + t.losses + t.ties,
      pct: t.wins + t.losses === 0 ? 0 : t.wins / (t.wins + t.losses),
    }))
    .sort((a, b) => b.pct - a.pct);

  const top = ranked[0];

  return (
    <main className="container">
      <div className="eyebrow">2026 시즌</div>
      <h1>팀 순위</h1>
      <p style={{ opacity: 0.6, marginBottom: 24 }}>
        승률 기준 정렬 · 게임차(GB)는 1위 팀 기준
      </p>

      {ranked.length === 0 ? (
        <div className="card">아직 등록된 팀이 없어요. 관리자가 팀을 추가하면 여기에 표시돼요.</div>
      ) : (
        <div className="scoreboard">
          <div className="scoreboard-row header">
            <span>#</span>
            <span>팀</span>
            <span>승</span>
            <span>패</span>
            <span>승률</span>
            <span>GB</span>
          </div>
          {ranked.map((t, i) => (
            <div className="scoreboard-row" key={t.id}>
              <span className="rank-num">{i + 1}</span>
              <span className="team-name">{t.name}</span>
              <span className="digit">{t.wins}</span>
              <span className="digit">{t.losses}</span>
              <span className="digit amber">{t.pct.toFixed(3).replace(/^0/, "")}</span>
              <span className="digit">
                {i === 0 ? "-" : calcGB(top.wins, top.losses, t.wins, t.losses).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
