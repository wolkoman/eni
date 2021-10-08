import {NextApiRequest, NextApiResponse} from 'next';
import {getEvents} from '../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../util/verify';

export default async function (req: NextApiRequest, res: NextApiResponse){

  const user = resolveUserFromRequest(req);

  const privateCalendarAccess = user && user.permissions[Permission.PrivateCalendarAccess];
  res.json(await getEvents({public: !privateCalendarAccess}));

}
