import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSkinFaceUrl } from "@/lib/mojang";

export const metadata = {
  title: "아마추어 야구리그",
  description: "팀 순위, 선수 프로필, 경기 예측",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <body>
        <nav className="nav">
          <a href="/" style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>
            ⚾ 리그 순위
          </a>
          <div className="nav-links">
            <a href="/">순위</a>
            <a href="/predictions">예측</a>
            <a href="/reviews">경기 리뷰</a>
            {session?.user.role === "ADMIN" && <a href="/admin">관리자</a>}
            {session ? (
              <a href={`/profile/${session.user.id}`}>
                {session.user.minecraftUuid && (
                  <img
                    src={getSkinFaceUrl(session.user.minecraftUuid, 20)}
                    alt=""
                    style={{ width: 16, height: 16, verticalAlign: "middle", marginRight: 6, imageRendering: "pixelated" }}
                  />
                )}
                {session.user.minecraftNickname || session.user.name}
              </a>
            ) : (
              <a href="/api/auth/signin">로그인</a>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
