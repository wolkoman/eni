import {getGoogleAuthClient} from "../(shared)/GoogleAuthClient";
import {google} from "googleapis";

import {CalendarEvent, GetEventOptions, GetEventPermission, mapEvent} from "./EventMapper";
import {CALENDAR_INFOS, CalendarName} from "./CalendarInfo";

export async function loadCalendar(
  calendarName: CalendarName,
  options: GetEventOptions,
  oauth2Client: any
): Promise<CalendarEvent[]> {
  if (!oauth2Client) oauth2Client = await getGoogleAuthClient();
  const todayDate = new Date();
  todayDate.setHours(0);
  const start = todayDate.getTime();
  const end = start + 3600000 * 24 * 30 * ({
    [GetEventPermission.PUBLIC]: 1,
    [GetEventPermission.READER]: 6,
    [GetEventPermission.PRIVATE_ACCESS]: 6,
  }[options.permission]);
  const hasTimeframe = options.permission === GetEventPermission.PRIVATE_ACCESS && options.timeFrame;

  const readerData = options.permission === GetEventPermission.PRIVATE_ACCESS && options.readerData
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
    .filter(event => options.permission !== GetEventPermission.READER || options.ids.includes(event.id))
    .map(event => ({...event, readerInfo: readerData?.[event.id!] ?? {reading1: null, reading2: null}}))
  )
}
