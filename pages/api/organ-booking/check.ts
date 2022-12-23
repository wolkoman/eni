import {NextApiRequest, NextApiResponse} from 'next';
import {getCalendarEvents, GetEventPermission} from '../../../util/calendar-events';
import {Temporal} from '@js-temporal/polyfill';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {CalendarName} from "../../../util/calendar-info";
import {CalendarTag} from "../../../util/calendar-types";
import {getCachedReaderData, invalidateCachedReaderData} from "../reader";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || !user.permissions[Permission.OrganBooking]) {
        res.status(401).json({});
        return;
    }

    const date: Date = new Date(req.query.date as string);

    res.json({
        slots: slots(date).map(getHour => getHour(0).toInstant().toString()),
        availableSlots: await getAvailableOrganSlotsForDate(date)
    });
}

const slots = (day: Date) => [9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(hour => (addedHour: number) => Temporal.ZonedDateTime.from({
    timeZone: 'Europe/Vienna',
    hour: hour + addedHour,
    day: day.getDate(),
    month: day.getMonth() + 1,
    year: day.getFullYear(),
}));

export async function getAvailableOrganSlotsForDate(date: Date): Promise<string[]> {

    const timeMin = new Date(date.toISOString());
    const timeMax = new Date(date.toISOString());
    timeMin.setHours(0);
    timeMax.setHours(24);

    const events = await Promise.all([
        CalendarName.INZERSDORF,
        CalendarName.INZERSDORF_ORGAN
    ].map(name => getCalendarEvents(name, {permission: GetEventPermission.PRIVATE_ACCESS, timeFrame:{min: timeMin, max: timeMax}, getReaderData: getCachedReaderData})
    )).then(eventList => eventList.flat().filter(event => event.tags.includes(CalendarTag.inChurch)));
    invalidateCachedReaderData();

    if (events.some(event => event.wholeday)) {
        return [];
    }
    return slots(timeMin).filter(getHour => events.length === 0 || events.every(event => !dateRangeOverlaps(
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
