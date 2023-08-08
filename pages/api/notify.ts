import {NextApiRequest, NextApiResponse} from 'next';

import {notifyAdmin} from "@/app/(shared)/Telegram";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  await notifyAdmin(req.body.message);
  res.json({});

}
