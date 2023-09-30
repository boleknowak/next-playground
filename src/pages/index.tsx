import { Button } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status: authed } = useSession();

  if (authed === 'loading') {
    return <main>Loading...</main>;
  }

  const user = session?.user as Partial<User>;
  const isAuthed = authed === 'authenticated';

  return (
    <main>
      {!isAuthed && (
        <div>
          <div>Hello World!</div>
          <Button colorScheme="blue" onClick={() => signIn('google')}>
            Google
          </Button>
        </div>
      )}
      {isAuthed && (
        <div>
          Hello, {user.name}
          <Button colorScheme="blue" onClick={() => signOut()}>
            Log off
          </Button>
        </div>
      )}
    </main>
  );
}
