import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getEventsFromCalendar} from '../../../util/calendarEvents';
import {cockpit} from '../../../util/cockpit-sdk';

const isContained = (check: Date, from: Date, to: Date) => (check.getTime() < to.getTime() && check.getTime() >= from.getTime());

export default async function (req: NextApiRequest, res: NextApiResponse){

  const organBookingAccess =
    req.query.token && await fetch(`${cockpit.host}/api/singletons/get/OrganBookingAccess?token=${req.query.token}`)
      .then(x => x.text())
      .then(x => x === "");

  if(!organBookingAccess){
    res.status(401).json({});
    return;
  }

  const dayStart = new Date(req.query.date as string);
  const dayEnd = new Date(req.query.date as string);
  dayStart.setHours(0);
  dayEnd.setHours(24);

  const events = await getEventsFromCalendar(calendarIds['inzersdorf-organ'], 'Orgel', false, dayStart, dayEnd);
  if(events.some(event => event.wholeday)){
    res.json([]);
    return;
  }

  res.json(['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].filter(hour => {
    const slotStart = new Date(`${req.query.date} ${hour}`);
    const slotEnd =  new Date(`${req.query.date} ${hour}`);
    slotEnd.setHours(slotEnd.getHours() + 1);

    return events.length === 0 || events.every(event => {
      const start = new Date(event.start.dateTime);
      const end =  new Date(event.end.dateTime);
      return !(isContained(start, slotStart, slotEnd) || isContained(end, slotStart, slotEnd));
    });
  }));


}
