import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getCachedGoogleAuthClient, getEventsFromCalendar} from '../../../util/calendarEvents';
import {cockpit} from '../../../util/cockpit-sdk';
import {google} from 'googleapis';
import {getAvailableOrganSlotsForDate} from './check';

export default async function (req: NextApiRequest & {query: {token: string, id: string }}, res: NextApiResponse) {

  const organBookingAccess =
    req.query.token && await fetch(`${cockpit.host}/api/singletons/get/OrganBookingAccess?token=${req.query.token}`)
      .then(x => x.text())
      .then(x => x === '');

  if (!organBookingAccess) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const oauth2Client = await getCachedGoogleAuthClient();
  const calendar = google.calendar('v3');
  calendar.events.delete({
    auth: oauth2Client,
    calendarId: calendarIds['inzersdorf-organ'],
    eventId: req.query.id
  }).then(() => {
    res.status(200).json({});
  }).catch((err) => {
    res.status(500).json({err});
  });

}
