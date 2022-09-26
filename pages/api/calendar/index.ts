import {NextApiRequest, NextApiResponse} from 'next';
import {getEventsForUser} from '../../../util/calendar-events';
import {resolveUserFromRequest} from '../../../util/verify';

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const user = resolveUserFromRequest(req)!;
  res.json(await getEventsForUser(user));
}
