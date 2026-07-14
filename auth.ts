import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      // 세션에 우리 커스텀 필드(관리자 여부, 마크 닉네임 등) 추가
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.role = dbUser.role;
        session.user.minecraftUuid = dbUser.minecraftUuid;
        session.user.minecraftNickname = dbUser.minecraftNickname;
        session.user.teamId = dbUser.teamId;
      }
      return session;
    },
  },
  events: {
    // 새로 가입한 유저가 DB에 첫 번째 유저면 자동으로 ADMIN 지정
    async createUser({ user }) {
      const userCount = await prisma.user.count();
      if (userCount === 1) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};
