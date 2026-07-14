"use client";

import { useState } from "react";

export default function LinkMinecraftForm() {
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    const res = await fetch("/api/link-minecraft", {
      method: "POST",
      body: JSON.stringify({ nickname }),
    });
    const data = await res.json();
    if (data.ok) {
      location.reload();
    } else {
      setMsg(data.error);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input placeholder="마인크래프트 닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <button className="btn btn-solid" onClick={submit}>연동</button>
      </div>
      {msg && <p style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
