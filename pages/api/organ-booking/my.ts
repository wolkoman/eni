import {NextApiRequest, NextApiResponse} from 'next';
import {getGoogleAuthClient} from "@/app/(shared)/GoogleAuthClient";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {loadCalendar} from "@/domain/events/CalendarLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined || !user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const oauth2Client = await getGoogleAuthClient();
  const events = await loadCalendar(
    CalendarName.INZERSDORF_ORGAN,
    {access: EventLoadAccess.PRIVATE_ACCESS},
    oauth2Client
  )
    .then(events => events.filter(event => event.summary === user.name));
  res.json(events);

}
