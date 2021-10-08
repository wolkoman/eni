import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getEventsFromCalendar} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';

export default async function (req: NextApiRequest, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  res.json((await getEventsFromCalendar(calendarIds['inzersdorf-organ'], 'Orgel', false)).filter(event => event.summary === user.name));

}
