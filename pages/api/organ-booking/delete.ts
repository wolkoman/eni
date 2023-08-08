import {NextApiRequest, NextApiResponse} from 'next';
import {google} from 'googleapis';
import {getGoogleAuthClient} from "../../../app/(shared)/GoogleAuthClient";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";

export default async function handler(req: NextApiRequest & {query: {token: string, id: string }}, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const oauth2Client = await getGoogleAuthClient();
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
