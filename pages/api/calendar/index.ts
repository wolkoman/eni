import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedEvents} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = resolveUserFromRequest(req);
  const privateCalendarAccess = user && user.permissions[Permission.PrivateCalendarAccess];
  res.json(await getCachedEvents(privateCalendarAccess ?? false));
}
