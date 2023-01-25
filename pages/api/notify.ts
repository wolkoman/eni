import {NextApiRequest, NextApiResponse} from 'next';
import {XMLParser} from "fast-xml-parser";
import {Permission, resolveUserFromRequest} from "../../util/verify";
import {cockpit} from "../../util/cockpit-sdk";
import {notifyAdmin} from "../../util/telegram";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  await notifyAdmin(req.body.message);
  res.json({});

}