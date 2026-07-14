"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 100 }}>
      <div className="eyebrow">로그인</div>
      <h1 style={{ marginBottom: 24 }}>리그에 들어가기</h1>
      <button
        className="btn btn-solid"
        style={{ fontSize: 15, padding: "14px 28px" }}
        onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
      >
        Microsoft 계정으로 로그인
      </button>
      <p style={{ opacity: 0.5, fontSize: 13, marginTop: 16, maxWidth: 320, textAlign: "center" }}>
        로그인 후 프로필에서 마인크래프트 닉네임을 연동하면 이후로는 마크 닉네임으로 표시돼요.
      </p>
    </main>
  );
}
