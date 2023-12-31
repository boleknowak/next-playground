import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(request: NextApiRequest, response: NextApiResponse<Data>) {
  return response.status(200).json({ name: 'John Doe' });
}
