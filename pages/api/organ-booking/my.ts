import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getEventsFromCalendar} from '../../../util/calendarEvents';
import {cockpit} from '../../../util/cockpit-sdk';

export default async function (req: NextApiRequest, res: NextApiResponse) {

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

  res.json((await getEventsFromCalendar(calendarIds['inzersdorf-organ'], 'Orgel', false)).filter(event => event.summary === user.name));

}
