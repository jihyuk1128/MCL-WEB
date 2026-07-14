# 아마추어 야구리그 사이트

Next.js + Prisma + PostgreSQL + NextAuth(Microsoft) 로 만든 리그 관리 사이트.

## 핵심 동작 방식

- **로그인**: Microsoft(Azure AD) 계정으로 로그인. 로그인 직후엔 이름이 MS 계정 이름으로 뜨는데,
  프로필 페이지에서 마인크래프트 닉네임을 입력하면 그 이후로는 사이트 전체에서 마크 닉네임 + 스킨 얼굴이 표시됨.
- **관리자 지정**: 코드 수정 없이 전부 웹사이트에서 처리.
  - 가장 처음 가입하는 사람이 자동으로 관리자가 됨.
  - 이후엔 관리자가 `/admin` 페이지 하단 "관리자 지정" 폼에서 다른 유저 이메일을 입력해 관리자로 승격/해제 가능.
- **관리자 페이지 (`/admin`)**: 팀 추가, 경기 일정 등록, 경기 결과 입력(입력하는 순간 팀 승/패 자동 반영 및 순위 갱신), 관리자 승격.

## 로컬 실행

```bash
npm install
cp .env.example .env   # 값 채우기
npx prisma migrate dev --name init
npm run dev
```

## 필요한 준비물

1. **PostgreSQL DB** — Vercel Postgres, Supabase, Railway 중 아무거나. 무료 티어로 충분함.
   발급받은 연결 문자열을 `.env`의 `DATABASE_URL`에 입력.

2. **Microsoft(Azure AD) 앱 등록**
   - https://portal.azure.com → "App registrations" → "New registration"
   - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad` (배포 후엔 실제 도메인으로 추가)
   - "Certificates & secrets"에서 client secret 발급
   - Application(client) ID, Client secret, Tenant ID를 `.env`에 입력
     (개인 계정도 받고 싶으면 `AZURE_AD_TENANT_ID=common`)

3. **NEXTAUTH_SECRET** — `openssl rand -base64 32` 로 생성해서 입력.

## 배포 (Vercel 추천)

1. 이 프로젝트를 GitHub repo에 push
2. Vercel에서 import
3. 위 환경변수들을 Vercel 프로젝트 Settings > Environment Variables에 등록
4. `NEXTAUTH_URL`은 실제 배포 도메인으로, Azure Redirect URI도 실제 도메인으로 추가
5. 배포 후 Vercel의 "Deployments" 쉘 또는 로컬에서 `DATABASE_URL`을 배포 DB로 바꿔서
   `npx prisma migrate deploy` 한 번 실행 (테이블 생성)

## 다음에 더 채워볼 만한 부분

- 마인크래프트 서버 UUID로 자동 화이트리스트 연동
- 시즌별 개인 타/투 스탯 (기존에 만들고 있던 Discord 봇 + 구글시트 데이터를 이 DB로 옮기거나 API로 연동 가능)
- 경기 리뷰에 이미지 첨부
- 예측 적중률 랭킹.
