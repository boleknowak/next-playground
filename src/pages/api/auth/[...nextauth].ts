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
            'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      const refreshToken = account?.refresh_token;
      const accessToken = account?.access_token;
      const scope = account?.scope;

      const user = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!user) {
        return token;
      }

      if (refreshToken && accessToken && scope) {
        const scopes = scope.split(' ');
        const accountScopes = await prisma.account.findFirst({
          where: {
            userId: token.sub,
            providerAccountId: account.providerAccountId,
          },
        });

        // eslint-disable-next-line no-unsafe-optional-chaining
        const newScopes = [...scopes, ...accountScopes.scope?.split(' ')];
        const uniqueScopes = [...new Set(newScopes)];

        await prisma.account.updateMany({
          where: {
            userId: token.sub,
            providerAccountId: account.providerAccountId,
          },
          data: {
            refresh_token: refreshToken,
            access_token: accessToken,
            scope: uniqueScopes.join(' '),
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
