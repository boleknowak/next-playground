import { Button } from '@chakra-ui/react';
import { Account, User } from '@prisma/client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, status: authed } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);

  const getAccounts = async () => {
    setIsLoading(true);

    const res = await fetch('/api/accounts');
    const data = await res.json();

    if (data.status === 'ok') {
      setAccounts(data.accounts);
      setAccount(data.accounts[0]);
      setIsLoading(false);
    }
  };

  const getBirthday = async (accessToken: string) => {
    const res = await fetch('https://people.googleapis.com/v1/people/me?personFields=birthdays', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();

    console.log(data);
  };

  const getAdwords = async (accessToken: string) => {
    try {
      const CUSTOMER_ID = process.env.NEXT_PUBLIC_CUSTOMER_ID;
      const MANAGER_ID = process.env.NEXT_PUBLIC_MANAGER_ID;

      const listAccessibleCustomersResponse = await fetch(
        `https://googleads.googleapis.com/v14/customers:listAccessibleCustomers`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'developer-token': process.env.NEXT_PUBLIC_DEVELOPER_TOKEN,
            'login-customer-id': MANAGER_ID,
          },
        }
      );
      const listAccessibleCustomersData = await listAccessibleCustomersResponse.json();

      const campaigns = await fetch(
        `https://googleads.googleapis.com/v14/customers/${CUSTOMER_ID}/googleAds:searchStream`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'developer-token': process.env.NEXT_PUBLIC_DEVELOPER_TOKEN,
            'login-customer-id': MANAGER_ID,
          },
          body: JSON.stringify({
            query: `SELECT campaign.id, campaign.name, campaign.status FROM campaign`,
          }),
        }
      );
      const campaignsData = await campaigns.json();

      console.log(listAccessibleCustomersData);
      console.log(campaignsData);
    } catch (error) {
      console.log(error);
    }
  };

  const isOAuthTokenValid = async (token) => {
    const BASE_API = 'https://www.googleapis.com/oauth2/v1/tokeninfo';
    const res = await fetch(`${BASE_API}?access_token=${token}`, {
      mode: 'cors',
    });

    const data = await res.json();

    console.log(data);
  };

  useEffect(() => {
    getAccounts();
  }, []);

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
          <div className="flex flex-row items-center space-x-2">
            <Button colorScheme="blue" onClick={() => signOut()}>
              Log off
            </Button>
            <Button
              colorScheme="blue"
              onClick={() =>
                signIn(
                  'google',
                  {
                    callbackUrl: 'http://localhost:3000',
                  },
                  {
                    scope: `${account.scope} https://www.googleapis.com/auth/user.birthday.read`,
                  }
                )
              }
            >
              Add Birthday
            </Button>
            <Button
              colorScheme="blue"
              onClick={() =>
                signIn(
                  'google',
                  {
                    callbackUrl: 'http://localhost:3000',
                  },
                  {
                    scope: `${account.scope} https://www.googleapis.com/auth/adwords`,
                  }
                )
              }
            >
              Add Adwords
            </Button>
          </div>
          {isLoading && <div>Loading...</div>}
          {!isLoading && accounts.length === 0 && <div>No accounts found</div>}
          {!isLoading && (
            <div>
              <div>
                {accounts[0].scope.split(' ').map((scope, scopeId) => (
                  <div key={scopeId}>{scope}</div>
                ))}
              </div>
              <div className="flex flex-row items-center space-x-2">
                <Button colorScheme="red" onClick={() => isOAuthTokenValid(account.access_token)}>
                  Is OAuth Token Valid
                </Button>
                <Button colorScheme="purple" onClick={() => getBirthday(account.access_token)}>
                  Get Birthday
                </Button>
                <Button colorScheme="green" onClick={() => getAdwords(account.access_token)}>
                  Get Adwords
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
