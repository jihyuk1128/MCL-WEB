import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSkinFaceUrl } from "@/lib/mojang";
import LinkMinecraftForm from "@/components/LinkMinecraftForm";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { team: true, reviews: { orderBy: { createdAt: "desc" }, take: 5 } },
  });

  if (!user) {
    return <main className="container"><p>유저를 찾을 수 없어요.</p></main>;
  }

  const isOwnProfile = session?.user.id === user.id;

  return (
    <main className="container">
      <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
        {user.minecraftUuid ? (
          <img src={getSkinFaceUrl(user.minecraftUuid, 80)} className="skin-face" style={{ width: 80, height: 80 }} alt="" />
        ) : (
          <div className="skin-face" style={{ width: 80, height: 80, background: "rgba(241,239,228,0.05)" }} />
        )}
        <div>
          <div className="eyebrow">선수 프로필</div>
          <h1 style={{ fontSize: 40 }}>
            {user.minecraftNickname || user.name}
            {user.role === "ADMIN" && <span className="badge-admin">관리자</span>}
          </h1>
          <p style={{ opacity: 0.6 }}>{user.team ? `소속: ${user.team.name}` : "무소속"}</p>
        </div>
      </div>

      {isOwnProfile && !user.minecraftUuid && (
        <section className="card" style={{ marginBottom: 24 }}>
          <h3>마인크래프트 닉네임 연동</h3>
          <p style={{ opacity: 0.6, fontSize: 13 }}>닉네임을 입력하면 스킨 얼굴과 함께 표시돼요.</p>
          <LinkMinecraftForm />
        </section>
      )}

      {user.team && (
        <section className="card" style={{ marginBottom: 24 }}>
          <h3>시즌 기록</h3>
          <p className="digit amber" style={{ fontSize: 20 }}>
            {user.team.wins}승 {user.team.losses}패
          </p>
        </section>
      )}

      <section className="card">
        <h3>최근 경기 리뷰</h3>
        {user.reviews.length === 0 ? (
          <p style={{ opacity: 0.6 }}>아직 작성한 리뷰가 없어요.</p>
        ) : (
          user.reviews.map((r) => (
            <div key={r.id} style={{ marginBottom: 12 }}>
              <strong>{r.title}</strong>
              <p style={{ opacity: 0.7, fontSize: 14 }}>{r.content}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
