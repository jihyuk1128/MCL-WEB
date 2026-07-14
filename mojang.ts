// Mojang API로 닉네임 -> UUID 변환, Crafatar로 얼굴 렌더링 이미지 URL 생성

export async function getMinecraftUuid(nickname: string): Promise<string | null> {
  const res = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(nickname)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.id as string; // 하이픈 없는 UUID
}

export function getSkinFaceUrl(uuid: string, size = 100): string {
  // 얼굴만 잘라서 보여주는 크래파터 이미지
  return `https://crafatar.com/avatars/${uuid}?size=${size}&overlay`;
}

export function getSkinFullBodyUrl(uuid: string): string {
  return `https://crafatar.com/renders/body/${uuid}?overlay`;
}
