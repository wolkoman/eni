import {NextApiRequest, NextApiResponse} from 'next';
import { getCachedGoogleAuthClient} from '../../../util/calendar-events';
import {google} from 'googleapis';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {CalendarName, getCalendarInfo} from "../../../util/calendar-info";

export default async function handler(req: NextApiRequest & {query: {token: string, id: string }}, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const oauth2Client = await getCachedGoogleAuthClient();
  const calendar = google.calendar('v3');
  calendar.events.delete({
    auth: oauth2Client,
    calendarId: getCalendarInfo(CalendarName.INZERSDORF_ORGAN).calendarId,
    eventId: req.query.id
  }).then(() => {
    res.status(200).json({});
  }).catch((err) => {
    res.status(500).json({err});
  });

}
