import {calendar_v3, google} from 'googleapis';
import {cockpit} from './cockpit-sdk';
import {site} from "./sites";
import {notifyAdmin} from "./telegram";
import {getTimeOfEvent} from "./get-time-of-event";
import {CALENDAR_INFOS, CalendarName} from "./calendar-info";
import {CalendarEvent, CalendarTag, EventsObject} from "./calendar-types";
import {getGroupFromEvent} from "./calendar-group";
import {ReaderData} from "./reader";
import {getCachedReaderData} from "../pages/api/reader";

const notInChurchRegex = /(Pfarrgarten|Pfarrheim|Pfarrhaus|Friedhof|kirchenfrei)/gi;
const cancelledRegex = /(abgesagt|findet nicht statt|entfällt)/gi;

export function mapGoogleEventToEniEvent(calendarName: CalendarName, options: GetEventOptions): (event: calendar_v3.Schema$Event) => CalendarEvent | null {
    return (event): CalendarEvent | null => {
        const displayPersonen = event?.summary?.split("/", 2)?.[1]?.trim() ?? null;
        const summary = event?.summary?.split('/', 2)[0] ?? "";
        const privateAccess = options.permission === GetEventPermission.PRIVATE_ACCESS;
        if (event.visibility === 'private' && !privateAccess) return null;
        return {
            id: event.id ?? "",
            mainPerson: displayPersonen,
            summary: privateAccess ? summary : summary.replace(/\[.*?]/g, ''),
            description: privateAccess ? event.description ?? '' : event.description?.replace(/\[.*?]/g, '') ?? '',
            date: (event.start?.date ?? event.start?.dateTime ?? '').substring(0, 10),
            start: event.start as { dateTime: string },
            end: event.end as { dateTime: string },
            calendar: calendarName,
            visibility: event.visibility ?? 'public',
            groups: getGroupFromEvent(event),
            tags: [
                !(event.summary + (event.description ?? '')).match(notInChurchRegex) && privateAccess && CalendarTag.inChurch,
                event.visibility === 'private' && CalendarTag.private,
                (event.summary + (event.description ?? '')).match(cancelledRegex) && CalendarTag.cancelled,
            ].filter((item): item is CalendarTag => !!item),
            wholeday: !!event.start?.date,
        };
    };
}

export async function getCalendarEvents(calendarName: CalendarName, options: GetEventOptions): Promise<CalendarEvent[]> {
    const calendarId = CALENDAR_INFOS[calendarName].calendarId;
    const oauth2Client = await getCachedGoogleAuthClient();
    const calendar = google.calendar('v3');
    const todayDate = new Date();
    todayDate.setHours(0);
    let start = todayDate.getTime();
    let end = start + 3600000 * 24 * 30 * ({
        [GetEventPermission.PUBLIC]: 1,
        [GetEventPermission.READER]: 6,
        [GetEventPermission.PRIVATE_ACCESS]: 6,
    }[options.permission]);
    const hasTimeframe = options.permission === GetEventPermission.PRIVATE_ACCESS && options.timeFrame;

    const eventsList = await calendar.events.list({
        maxResults: 1000,
        calendarId,
        auth: oauth2Client,
        timeMin: (hasTimeframe ? options.timeFrame!.min : new Date(start)).toISOString(),
        timeMax: (hasTimeframe ? options.timeFrame!.max : new Date(end)).toISOString(),
        singleEvents: true,
        timeZone: 'Europa/Vienna',
        orderBy: 'startTime'
    });
    const readerData = await ([GetEventPermission.PRIVATE_ACCESS, GetEventPermission.READER].includes(options.permission)
            ? getCachedReaderData()
            : Promise.resolve({})
    );


    function getReaderInfo(event: CalendarEvent) {
        const readerInfo = readerData?.[event.id!] ?? {reading1: null, reading2: null};
        return (readerInfo.reading1 ? `<br/>1.Lesung: ${readerInfo.reading1?.name}` :'') + (readerInfo.reading2 ? `<br/>2.Lesung: ${readerInfo.reading2?.name}` :'');

    }

    return eventsList.data.items!.map(mapGoogleEventToEniEvent(calendarName, options))
        .filter((event): event is CalendarEvent => !!event?.summary)
        .filter(event => options.permission !== GetEventPermission.READER || options.ids.includes(event.id))
        .map(event => ({...event, description: event.description + getReaderInfo(event)}))
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

export function getCalendarsEvents(options: GetEventOptions): Promise<CalendarEvent[]> {
    return Promise.all(
        site(
            [CalendarName.ALL, CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT],
            [CalendarName.ALL, CalendarName.EMMAUS]
        )
            .map((name) => getCalendarEvents(name, options))
    )
        .then(eventList => eventList.flat())
        .then(events => events.filter(event => !!event))
        .then(events => events.sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b)));
}

export enum GetEventPermission {
    PUBLIC = "PUBLIC",
    PRIVATE_ACCESS = "PRIVATE_ACCESS",
    READER = "READER",
}

export type GetEventOptions =
    { permission: GetEventPermission.PUBLIC }
    | { permission: GetEventPermission.PRIVATE_ACCESS, timeFrame?: {min: Date, max: Date } }
    | { permission: GetEventPermission.READER, ids: string[] }

export const getCachedEvents = async (options: GetEventOptions): Promise<EventsObject> => {
    const calendarCacheId = '61b335996165305292000383';
    const events = await getCalendarsEvents(options).catch(() => null);
    if (events !== null) {
        if (options.permission === GetEventPermission.PUBLIC && site(true, false)) {
            cockpit.collectionSave('internal-data', {
                _id: calendarCacheId,
                data: {events, cache: new Date().toISOString()}
            }).catch();
        }
        return {events, cache: null};
    } else {
        const cachedEvents = await cockpit.collectionGet('internal-data', {filter: {_id: calendarCacheId}}).then(x => x.entries[0].data);
        await notifyAdmin('Google Calendar failed');
        return cachedEvents;
    }
}
