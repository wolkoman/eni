import {NextApiRequest, NextApiResponse} from 'next';

import {fetchInstagramFeed} from "@/app/(shared)/Instagram";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  res.json(fetchInstagramFeed());
}
