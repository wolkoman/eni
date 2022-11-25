import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedEvents, GetEventPermission} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = resolveUserFromRequest(req);
  const privateAccess = user && user.permissions[Permission.PrivateCalendarAccess];
  res.json(await getCachedEvents({permission: privateAccess ? GetEventPermission.PRIVATE_ACCESS : GetEventPermission.PUBLIC }));
}
