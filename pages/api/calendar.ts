import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';
import {getEvents} from '../../util/calendar-events';

export default async function (req: NextApiRequest, res: NextApiResponse){

  const privateCalendarAccess =
    req.query.token
    && await fetch(`${cockpit.host}/api/singletons/get/PrivateCalendarAccess?token=${req.query.token}`)
      .then(x => x.text())
      .then(x => x === "");

  res.json(await getEvents({public: !privateCalendarAccess}));

}
