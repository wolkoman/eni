import {NextApiRequest, NextApiResponse} from 'next';
import {getCalendarEvents, GetEventPermission} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {CalendarName} from "../../../util/calendar-info";
import {getCachedReaderData, invalidateCachedReaderData} from "../reader";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const events = await getCalendarEvents(CalendarName.INZERSDORF_ORGAN, {permission: GetEventPermission.PRIVATE_ACCESS, getReaderData: getCachedReaderData})
      .then(events => events.filter(event => event.summary === user.name));
  invalidateCachedReaderData();
  res.json(events);

}
