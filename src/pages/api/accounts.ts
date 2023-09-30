import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.json({
      status: 'error',
      message: 'unauthenticated',
    });
  }

  const user = session?.user as Partial<User>;

  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
  });

  return response.status(200).json({ status: 'ok', accounts });
}
