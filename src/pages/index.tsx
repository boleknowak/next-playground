import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status: authed } = useSession();

  if (authed === 'loading') {
    return <main>Loading...</main>;
  }

  const user = session?.user as Partial<User>;
  const isAuthed = authed === 'authenticated';

  return (
    <main>
      <div>Hello World!</div>
      {isAuthed && <div>Hello, {user.name}</div>}
    </main>
  );
}
