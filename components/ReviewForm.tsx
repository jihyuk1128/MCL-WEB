"use client";

import { useState } from "react";

export default function ReviewForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function submit() {
    const res = await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (data.ok) location.reload();
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        placeholder="오늘 경기 어땠나요?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ fontFamily: "var(--font-body)", background: "rgba(241,239,228,0.05)", border: "1px solid rgba(241,239,228,0.2)", color: "var(--chalk-white)", padding: 10, borderRadius: 4 }}
      />
      <button className="btn btn-solid" style={{ width: 120 }} onClick={submit}>게시</button>
    </div>
  );
}
