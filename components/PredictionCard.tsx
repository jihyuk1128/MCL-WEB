"use client";

import { useState } from "react";

type Team = { id: string; name: string };

export default function PredictionCard({
  gameId,
  homeTeam,
  awayTeam,
  homeVotes,
  awayVotes,
  myPick,
  loggedIn,
}: {
  gameId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeVotes: number;
  awayVotes: number;
  myPick: string | null;
  loggedIn: boolean;
}) {
  const [pick, setPick] = useState(myPick);
  const total = homeVotes + awayVotes || 1;

  async function vote(teamId: string) {
    if (!loggedIn) {
      location.href = "/api/auth/signin";
      return;
    }
    const res = await fetch("/api/predictions", {
      method: "POST",
      body: JSON.stringify({ gameId, predictedWinnerId: teamId }),
    });
    const data = await res.json();
    if (data.ok) setPick(teamId);
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          className={pick === homeTeam.id ? "btn btn-solid" : "btn"}
          onClick={() => vote(homeTeam.id)}
        >
          {homeTeam.name}
        </button>
        <span style={{ opacity: 0.5, fontFamily: "var(--font-mono)" }}>VS</span>
        <button
          className={pick === awayTeam.id ? "btn btn-solid" : "btn"}
          onClick={() => vote(awayTeam.id)}
        >
          {awayTeam.name}
        </button>
      </div>
      <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: "rgba(241,239,228,0.1)", overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${(homeVotes / total) * 100}%`, background: "var(--scoreboard-amber)" }} />
      </div>
      <p style={{ fontSize: 12, opacity: 0.5, marginTop: 6, fontFamily: "var(--font-mono)" }}>
        {homeVotes}표 · {awayVotes}표
      </p>
    </div>
  );
}
