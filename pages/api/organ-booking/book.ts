import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedGoogleAuthClient} from '../../../util/calendar-events';
import {google} from 'googleapis';
import {getAvailableOrganSlotsForDate} from './check';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {CalendarName, getCalendarInfo} from "../../../util/calendar-info";

export default async function handler(req: NextApiRequest & {query: {token: string, date: string, hour: string, userId: string, }}, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const date = () => new Date(req.query.slot as string);
  const slots = await getAvailableOrganSlotsForDate(date());
  if (!slots.includes(req.query.slot as string)) {
    res.status(400).json({errorMessage: 'Slot nicht verfügbar'});
    return;
  }
  if (date().getTime() < new Date().getTime()) {
    res.status(400).json({errorMessage: 'Slot liegt in der Vergangenheit'});
    return;
  }

  const startDateTime = date();
  const endDateTime = date();
  endDateTime.setMinutes(endDateTime.getMinutes() + 60);

  const oauth2Client = await getCachedGoogleAuthClient();
  const calendar = google.calendar('v3');

  calendar.events.insert({
    auth: oauth2Client,
    calendarId: getCalendarInfo(CalendarName.INZERSDORF_ORGAN).calendarId,
    requestBody: {
      summary: user.name,
      description: `Gebucht: ${new Date().toISOString()}`,
      start: {dateTime: startDateTime.toISOString()},
      end: {dateTime: endDateTime.toISOString()},
    }
  }).then((event) => {
    res.status(200).json(event.data);
  }).catch((err) => {
    res.status(500).json({err});
  });
}
