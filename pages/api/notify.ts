import {NextApiRequest, NextApiResponse} from 'next';
import {notifyAdmin} from "../../util/telegram";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  await notifyAdmin(req.body.message);
  res.json({});

}