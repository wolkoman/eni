import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getEventsFromCalendar} from '../../../util/calendar-events';
import {cockpit} from '../../../util/cockpit-sdk';

const isContained = (check: Date, from: Date, to: Date) => (check.getTime() < to.getTime() && check.getTime() >= from.getTime());

export default async function (req: NextApiRequest, res: NextApiResponse) {

  const organBookingAccess =
    req.query.token && await fetch(`${cockpit.host}/api/singletons/get/OrganBookingAccess?token=${req.query.token}`)
      .then(x => x.text())
      .then(x => x === '');

  if (!organBookingAccess) {
    res.status(401).json({});
    return;
  }

  res.json({slots , availableSlots: await getAvailableOrganSlotsForDate(req.query.date as string)});
}

const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
export async function getAvailableOrganSlotsForDate(date: string): Promise<string[]> {

  const dayStart = new Date(date as string);
  const dayEnd = new Date(date as string);
  dayStart.setHours(0);
  dayEnd.setHours(24);

  const organEvents = await getEventsFromCalendar(calendarIds['inzersdorf-organ'], 'Orgel', false, dayStart, dayEnd);
  const inzersdorfEvents = (await getEventsFromCalendar(calendarIds['inzersdorf'], 'Orgel', false, dayStart, dayEnd))
    .filter(event => event.summary.match(/(Messe|Taufe|Gottesdienst)/gi));
  const events = [...organEvents, ...inzersdorfEvents];


  if (events.some(event => event.wholeday)) {
    return [];
  }

  return slots.filter(hour => {
    const slotStart = new Date(`${date}T${hour}:00.000Z`);
    const slotEnd = new Date(`${date}T${hour}:00.000Z`);
    let timezoneOffset = new Date(date as string).getTime() < new Date('2021-10-31T03:00:00.000Z').getTime() ? 2 : 1;
    slotStart.setHours(slotStart.getHours() - timezoneOffset);
    slotEnd.setMinutes(50);
    slotEnd.setHours(slotEnd.getHours() - timezoneOffset);

    return events.length === 0 || events.every(event => {
      const overlaps = dateRangeOverlaps(
        new Date(event.start.dateTime).getTime(),
        new Date(event.end.dateTime).getTime(),
        slotStart.getTime(),
        slotEnd.getTime()
      );
      return !overlaps;
    });
  });
}


function dateRangeOverlaps(a_start: number, a_end: number, b_start: number, b_end: number) {
  console.log(new Date(a_start), new Date(a_end), new Date(b_start), new Date(b_end));
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}
