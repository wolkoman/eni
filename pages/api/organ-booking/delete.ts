import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getCachedGoogleAuthClient} from '../../../util/calendar-events';
import {google} from 'googleapis';
import {Permission, resolveUserFromRequest} from '../../../util/verify';

export default async function (req: NextApiRequest & {query: {token: string, id: string }}, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.OrganBooking]) {
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
