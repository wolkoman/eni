import {google} from 'googleapis';
import {cockpit} from './cockpit-sdk';

export const calendarIds = {
  'all': 'admin@tesarekplatz.at',
  'emmaus': 'u08nlhov79dkit0ffi993o6tuk@group.calendar.google.com',
  'inzersdorf': '4fgiuth4nbbi5uqfa35tidnl84@group.calendar.google.com',
  'neustift': 'occ77f3f7sderl9e3b4jdnr5ek@group.calendar.google.com',
  'inzersdorf-organ': '3i1uurj6bgl1q91l1peejmfa80@group.calendar.google.com'
};
export type Calendar = keyof typeof calendarIds;

export interface CalendarEvent {
  id: string,
  summary: string,
  mainPerson?: string,
  description: string,
  date: string,
  start: { dateTime: string },
  end: { dateTime: string },
  calendar: Calendar,
  visibility: string,
  wholeday: boolean,
  tags: ('in-church' | 'private' | 'cancelled' | 'liturgy')[]
}

export type CalendarEvents = Record<string, CalendarEvent[]>;

const notInChurchRegex = /(Pfarrgarten|Pfarrheim|Pfarrhaus|Friedhof|kirchenfrei)/gi;
const cancelledRegex = /(abgesagt|findet nicht statt)/gi;
const liturgyRegex = /(Messe|Rorate)/gi;

export async function getEventsFromCalendar(calendarId: string, calendarName: string, isPublic: boolean, timeMin?: Date, timeMax?: Date): Promise<CalendarEvent[]> {
  const oauth2Client = await getCachedGoogleAuthClient();
  const calendar = google.calendar('v3');
  const todayDate = new Date();
  todayDate.setHours(0);
  let start = todayDate.getTime();
  let end = start + 3600000 * 24 * 30 * (isPublic ? 1 : 6);
  if (timeMin) start = timeMin.getTime();
  if (timeMax) end = timeMax.getTime();

  const eventsList = await calendar.events.list({
    maxResults: 1000,
    calendarId,
    auth: oauth2Client,
    timeMin: new Date(start).toISOString(),
    timeMax: new Date(end).toISOString(),
    singleEvents: true,
    timeZone: 'Europa/Vienna',
    orderBy: 'startTime'
  });

  return eventsList.data.items!.map(event => {
    const displayPersonen = event?.summary?.split("/", 2)?.[1];
    return ({
      id: event.id,
      summary: event?.summary?.split('/', 2)[0],
      mainPerson: displayPersonen,
      description: event.description ?? '',
      date: (event.start?.date ?? event.start?.dateTime ?? '').substr(0, 10),
      start: event.start,
      end: event.end,
      calendar: calendarName,
      visibility: event.visibility ?? 'public',
      tags: [
        !(event.summary + (event.description ?? '')).match(notInChurchRegex) && 'in-church',
        (event.visibility === 'private') && 'private',
        (event.summary + (event.description ?? '')).match(cancelledRegex) && 'cancelled',
        event.summary?.match(liturgyRegex) && 'liturgy',
      ].filter(item => item),
      wholeday: !!event.start?.date,
    } as CalendarEvent);
  }).filter(event => event.summary)
    .filter(event => !isPublic || event?.visibility === 'public')
    .map(event => !isPublic ? event : ({
      ...event,
      summary: event.summary.replace(/\[.*?]/g, ''),
      description: event.description?.replace(/\[.*?]/g, ''),
    }));
}

let oauth2Client: any;

export async function getCachedGoogleAuthClient() {
  if (oauth2Client) return oauth2Client;
  const configResponse = await cockpit.collectionGet('internal-data', {filter: {_id: '60d2474f6264631a2e00035c'}});
  const config = configResponse.entries[0].data;
  oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_KEY,
  );
  oauth2Client.setCredentials(config);
  return oauth2Client;
}

export async function getEvents(props: { public: boolean }): Promise<CalendarEvents> {

  const getTimeOfEvent = (event: any) => new Date(event!.start?.date ?? event!.start?.dateTime!).getTime();
  const allEvents = (await Promise.all(
    Object.entries(calendarIds).filter(([name, calendarId]) => [
      calendarIds.all,
      calendarIds.emmaus,
      calendarIds.inzersdorf,
      calendarIds.neustift
    ].includes(calendarId)).map(([name, calendarId]) => getEventsFromCalendar(calendarId, name, props.public))
  ))
    .flat()
    .filter(event => !!event);

  return allEvents
    .sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b))
    .reduce((previous, current) => {
      previous[current!.date] = previous[current!.date] ?? [];
      previous[current!.date].push(current);
      return previous;
    }, {} as any);

}