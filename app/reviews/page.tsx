import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ReviewForm from "@/components/ReviewForm";
import { getSkinFaceUrl } from "@/lib/mojang";

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  const reviews = await prisma.review.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <main className="container">
      <div className="eyebrow">하이라이트</div>
      <h1>경기 리뷰</h1>

      {session && (
        <section className="card" style={{ marginBottom: 24 }}>
          <h3>리뷰 작성</h3>
          <ReviewForm />
        </section>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {reviews.map((r) => (
          <div key={r.id} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {r.user.minecraftUuid && (
                <img src={getSkinFaceUrl(r.user.minecraftUuid, 24)} className="skin-face" style={{ width: 24, height: 24 }} alt="" />
              )}
              <span style={{ fontSize: 13, opacity: 0.6 }}>{r.user.minecraftNickname || r.user.name}</span>
            </div>
            <h3 style={{ fontSize: 20 }}>{r.title}</h3>
            <p style={{ opacity: 0.75 }}>{r.content}</p>
          </div>
        ))}
        {reviews.length === 0 && <div className="card">아직 리뷰가 없어요.</div>}
      </div>
    </main>
  );
}
