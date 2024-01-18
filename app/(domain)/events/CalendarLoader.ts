import {getGoogleAuthClient} from "../../(shared)/GoogleAuthClient";
import {google} from "googleapis";

import {CALENDAR_INFOS, CalendarName} from "./CalendarInfo";
import {CalendarEvent, mapEvent} from "./EventMapper";
import {EventLoadAccess, EventLoadOptions} from "@/domain/events/EventLoadOptions";

export async function loadCalendar(
  calendarName: CalendarName,
  options: EventLoadOptions,
  oauth2Client: any
): Promise<CalendarEvent[]> {
  if (!oauth2Client) oauth2Client = await getGoogleAuthClient();
  const todayDate = new Date();
  todayDate.setHours(0);
  const start = todayDate.getTime();
  const end = start + 3600000 * 24 * 30 * ({
    [EventLoadAccess.WEEKLY]: 1,
    [EventLoadAccess.PUBLIC]: 1,
    [EventLoadAccess.READER]: 6,
    [EventLoadAccess.PRIVATE_ACCESS]: 6,
  }[options.access]);
  const hasTimeframe = options.access === EventLoadAccess.PRIVATE_ACCESS && options.timeFrame;

  const readerData = options.access === EventLoadAccess.PRIVATE_ACCESS && options.readerData
    ? options.readerData
    : {}
  ;
  return google.calendar('v3').events.list({
    maxResults: 1000,
    calendarId: CALENDAR_INFOS[calendarName].calendarId,
    auth: oauth2Client,
    timeMin: (hasTimeframe ? options.timeFrame!.min : new Date(start)).toISOString(),
    timeMax: (hasTimeframe ? options.timeFrame!.max : new Date(end)).toISOString(),
    singleEvents: true,
    timeZone: 'Europa/Vienna',
    orderBy: 'startTime'
  }).then(result => result
    .data.items!.map(mapEvent(calendarName, options))
    .filter((event): event is CalendarEvent => !!event?.summary)
    .filter(event => options.access !== EventLoadAccess.READER || options.ids.includes(event.id))
    .map(event => ({...event, readerInfo: readerData?.[event.id!] ?? {reading1: null, reading2: null}}))
  )
}
