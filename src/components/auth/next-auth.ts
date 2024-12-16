import NextAuth, { Session, User } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import logo from "@/public/logoAndName.png";
// import config from "@/config";
import { prisma } from "../../lib/prisma";

interface UserExtended extends User {
  id: string;
  role: string | undefined;
}

interface SessionExtended extends Session {
  user: UserExtended;
}

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter: any;
}

export const authOptions: NextAuthOptionsExtended = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
          role: "CUSTOMER",
        };
      },
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: "noreply@shop-themes.com",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token }): Promise<SessionExtended> {
      if (session?.user) {
        const [dbUser] = await Promise.all([
          prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              id: true,
              role: true,
            },
          }),
        ]);
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub!,
            role: dbUser?.role,
          },
        };
      }
      return session as SessionExtended;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
