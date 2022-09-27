import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getCalendarEvents} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  res.json((await getCalendarEvents(calendarIds['inzersdorf-organ'], 'Orgel', {public: false})).filter(event => event.summary === user.name));

}
