import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {getGoogleAuthClient} from "../../../app/(shared)/GoogleAuthClient";
import {GetEventPermission} from "../../../app/termine/EventMapper";
import {CalendarName} from "../../../app/termine/CalendarInfo";
import {loadCalendar} from "../../../app/termine/CalendarLoader.server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined || !user.permissions[Permission.OrganBooking]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const oauth2Client = await getGoogleAuthClient();
  const events = await loadCalendar(
    CalendarName.INZERSDORF_ORGAN,
    {permission: GetEventPermission.PRIVATE_ACCESS},
    oauth2Client
  )
    .then(events => events.filter(event => event.summary === user.name));
  res.json(events);

}
