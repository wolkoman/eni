import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let body = JSON.parse(req.body);
  const user = await cockpit.authUser(body.username, body.password);
  res.status(user.error ? 401 : 200).json(user);
}