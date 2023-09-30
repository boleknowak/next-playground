import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';
import { User } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope:
            'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      const refreshToken = account?.refresh_token;

      const user = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!user) {
        return token;
      }

      if (refreshToken) {
        await prisma.account.updateMany({
          where: {
            userId: token.sub,
            providerAccountId: account.providerAccountId,
          },
          data: {
            refresh_token: refreshToken,
          },
        });
      }

      return {
        ...token,
        email: user.email,
      };
    },
    async session({ session }) {
      if (!session) return null;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) return session;

      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        created_at: user.created_at,
      } as Partial<User>;

      return session;
    },
  },
};

export default NextAuth(authOptions);
