import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getEventsFromCalendar} from '../../../util/calendar-events';
import {cockpit} from '../../../util/cockpit-sdk';
import {Temporal} from '@js-temporal/polyfill';

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

  const date: Date = new Date(req.query.date as string);

  res.json({slots: slots(date).map(getHour => getHour(0).toInstant().toString()), availableSlots: await getAvailableOrganSlotsForDate(date)});
}

const slots = (day: Date) => [9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(hour => (addedHour: number) => Temporal.ZonedDateTime.from({
  timeZone: 'Europe/Vienna',
  hour: hour + addedHour,
  day: day.getDate(),
  month: day.getMonth()+1,
  year: day.getFullYear(),
}));
const slotDuration = 1;

export async function getAvailableOrganSlotsForDate(date: Date): Promise<string[]> {

  const dayStart = new Date(date.toISOString());
  const dayEnd = new Date(date.toISOString());
  dayStart.setHours(0);
  dayEnd.setHours(24);

  const organEvents = await getEventsFromCalendar(calendarIds['inzersdorf-organ'], 'Orgel', false, dayStart, dayEnd);
  const inzersdorfEvents = (await getEventsFromCalendar(calendarIds['inzersdorf'], 'Orgel', false, dayStart, dayEnd))
    .filter(event => event.summary.match(/(Messe|Taufe|Gottesdienst|Taufe|Chor|Kirche)/gi));
  const events = [...organEvents, ...inzersdorfEvents];

  if (events.some(event => event.wholeday)) {
    return [];
  }
  return slots(dayStart).filter(getHour => events.length === 0 || events.every(event => !dateRangeOverlaps(
    new Date(event.start.dateTime).getTime(),
    new Date(event.end.dateTime).getTime(),
    new Date(getHour(0).toInstant().epochMilliseconds).getTime(),
    new Date(getHour(1).toInstant().epochMilliseconds).getTime(),
  ))).map(getHour => getHour(0).toInstant().toString());
}

function dateRangeOverlaps(a_start: number, a_end: number, b_start: number, b_end: number) {
  if (a_start <= b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end && b_end <= a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}
