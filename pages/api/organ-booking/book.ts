import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getCachedGoogleAuthClient, getEventsFromCalendar} from '../../../util/calendar-events';
import {cockpit} from '../../../util/cockpit-sdk';
import {google} from 'googleapis';
import {getAvailableOrganSlotsForDate} from './check';
import {Temporal} from '@js-temporal/polyfill';

export default async function (req: NextApiRequest & {query: {token: string, date: string, hour: string, userId: string, }}, res: NextApiResponse) {

  const organBookingAccess =
    req.query.token && await fetch(`${cockpit.host}/api/singletons/get/OrganBookingAccess?token=${req.query.token}`)
      .then(x => x.text())
      .then(x => x === '');

  if (!organBookingAccess) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const user = await cockpit.listUsers().then((users: any) => users.find((user: any) => req.query.userId === user._id));

  if (!user) {
    res.status(400).json({errorMessage: 'User not found'});
    return;
  }

  const date = () => new Date(req.query.slot as string);
  const slots = await getAvailableOrganSlotsForDate(date());
  if (!slots.includes(req.query.slot as string)) {
    res.status(400).json({errorMessage: 'Slot not available'});
    return;
  }

  const startDateTime = date();
  const endDateTime = date();
  endDateTime.setMinutes(endDateTime.getMinutes() + 50);

  const oauth2Client = await getCachedGoogleAuthClient();
  const calendar = google.calendar('v3');

  calendar.events.insert({
    auth: oauth2Client,
    calendarId: calendarIds['inzersdorf-organ'],
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
