"use client";

import { useState } from "react";

type Team = { id: string; name: string; wins: number; losses: number };
type Game = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  playedAt: string;
};

export default function AdminPanel({ teams, games }: { teams: Team[]; games: Game[] }) {
  const [teamName, setTeamName] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [playedAt, setPlayedAt] = useState("");
  const [promoteEmail, setPromoteEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function addTeam() {
    const res = await fetch("/api/admin/teams", {
      method: "POST",
      body: JSON.stringify({ name: teamName }),
    });
    const data = await res.json();
    setMsg(data.ok ? `"${data.team.name}" 팀 추가됨` : data.error);
    if (data.ok) { setTeamName(""); location.reload(); }
  }

  async function scheduleGame() {
    const res = await fetch("/api/admin/games", {
      method: "POST",
      body: JSON.stringify({ homeTeamId, awayTeamId, playedAt }),
    });
    const data = await res.json();
    setMsg(data.ok ? "경기 일정 등록됨" : data.error);
    if (data.ok) location.reload();
  }

  async function submitResult(gameId: string, homeScore: number, awayScore: number) {
    const res = await fetch("/api/admin/games", {
      method: "PATCH",
      body: JSON.stringify({ gameId, homeScore, awayScore }),
    });
    const data = await res.json();
    setMsg(data.ok ? "결과 반영됨 (순위 자동 갱신)" : data.error);
    if (data.ok) location.reload();
  }

  async function promote(makeAdmin: boolean) {
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      body: JSON.stringify({ email: promoteEmail, makeAdmin }),
    });
    const data = await res.json();
    setMsg(data.ok ? `${promoteEmail} 권한 변경됨` : data.error);
    if (data.ok) setPromoteEmail("");
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {msg && <div className="card" style={{ borderColor: "var(--scoreboard-amber)" }}>{msg}</div>}

      <section className="card">
        <h3>팀 추가</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="팀 이름" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          <button className="btn btn-solid" onClick={addTeam}>추가</button>
        </div>
      </section>

      <section className="card">
        <h3>경기 일정 등록</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}>
            <option value="">홈팀 선택</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}>
            <option value="">원정팀 선택</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="datetime-local" value={playedAt} onChange={(e) => setPlayedAt(e.target.value)} />
          <button className="btn" onClick={scheduleGame}>등록</button>
        </div>
      </section>

      <section className="card">
        <h3>경기 결과 입력</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {games.map((g) => (
            <GameRow key={g.id} game={g} onSubmit={submitResult} />
          ))}
          {games.length === 0 && <p style={{ opacity: 0.6 }}>등록된 경기가 없어요.</p>}
        </div>
      </section>

      <section className="card">
        <h3>관리자 지정</h3>
        <p style={{ opacity: 0.6, fontSize: 13 }}>다른 유저를 관리자로 지정하거나 해제할 수 있어요.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="유저 이메일" value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} />
          <button className="btn btn-solid" onClick={() => promote(true)}>관리자 지정</button>
          <button className="btn" onClick={() => promote(false)}>해제</button>
        </div>
      </section>
    </div>
  );
}

function GameRow({ game, onSubmit }: { game: Game; onSubmit: (id: string, h: number, a: number) => void }) {
  const [home, setHome] = useState(game.homeScore ?? 0);
  const [away, setAway] = useState(game.awayScore ?? 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 14 }}>
      <span style={{ width: 90 }}>{game.homeTeam.name}</span>
      <input type="number" value={home} onChange={(e) => setHome(Number(e.target.value))} style={{ width: 56 }} />
      <span>:</span>
      <input type="number" value={away} onChange={(e) => setAway(Number(e.target.value))} style={{ width: 56 }} />
      <span style={{ width: 90 }}>{game.awayTeam.name}</span>
      <span style={{ opacity: 0.5, fontSize: 11 }}>{game.status}</span>
      <button className="btn" onClick={() => onSubmit(game.id, home, away)}>저장</button>
    </div>
  );
}
