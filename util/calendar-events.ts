import {calendar_v3, google} from 'googleapis';
import {cockpit} from './cockpit-sdk';
import {site} from "./sites";
import {notifyAdmin} from "./telegram";
import {getTimeOfEvent} from "./get-time-of-event";
import {CALENDAR_INFOS, CalendarName} from "./calendar-info";
import {CalendarEvent, CalendarTag, EventsObject} from "./calendar-types";
import {getGroupFromEvent} from "./calendar-group";

const notInChurchRegex = /(Pfarrgarten|Pfarrheim|Pfarrhaus|Friedhof|kirchenfrei)/gi;
const cancelledRegex = /(abgesagt|findet nicht statt|entfällt)/gi;

export function mapGoogleEventToEniEvent(calendarName: CalendarName, isPublic: boolean): (event: calendar_v3.Schema$Event) => CalendarEvent | null {
    return (event): CalendarEvent | null => {
        const displayPersonen = event?.summary?.split("/", 2)?.[1] ?? null;
        const summary = event?.summary?.split('/', 2)[0] ?? "";
        if(event.visibility === 'private' && isPublic) return null;
        return ({
            id: event.id ?? "",
            mainPerson: displayPersonen,
            summary: isPublic ? summary.replace(/\[.*?]/g, '') : summary ,
            description:( isPublic ? event.description?.replace(/\[.*?]/g, '') : event.description) ?? '',
            date: (event.start?.date ?? event.start?.dateTime ?? '').substr(0, 10),
            start: event.start as {dateTime: string},
            end: event.end as {dateTime: string},
            calendar: calendarName,
            visibility: event.visibility ?? 'public',
            groups: getGroupFromEvent(event),
            tags: [
                !(event.summary + (event.description ?? '')).match(notInChurchRegex) && !isPublic && CalendarTag.inChurch,
                (event.visibility === 'private') && CalendarTag.private,
                (event.summary + (event.description ?? '')).match(cancelledRegex) && CalendarTag.cancelled,
            ].filter((item): item is CalendarTag => !!item),
            wholeday: !!event.start?.date,
        });
    };
}

export async function getCalendarEvents(calendarName: CalendarName, options: { public: boolean } | { timeMin: Date, timeMax: Date }): Promise<CalendarEvent[]> {
    const calendarId = CALENDAR_INFOS[calendarName].calendarId;
    const oauth2Client = await getCachedGoogleAuthClient();
    const calendar = google.calendar('v3');
    const todayDate = new Date();
    todayDate.setHours(0);
    let isPublic = 'public' in options ? options.public : false;
    let start = todayDate.getTime();
    let end = start + 3600000 * 24 * 30 * (isPublic ? 1 : 6);
    if (!('public' in options)) {
        start = options.timeMin.getTime();
        end = options.timeMax.getTime();
    }

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

    return eventsList.data.items!.map(mapGoogleEventToEniEvent(calendarName, isPublic))
        .filter((event): event is CalendarEvent => !!event?.summary)
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
export function getParishEvents(props: { public: boolean }): Promise<CalendarEvent[]> {
    return Promise.all(
        site(
            [CalendarName.ALL, CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT],
            [CalendarName.ALL, CalendarName.EMMAUS]
        )
            .map((name) => getCalendarEvents(name, {public: props.public}))
    )
        .then(eventList => eventList.flat())
        .then(events => events.filter(event => !!event))
        .then(events => events.sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b)));
}

export const getCachedEvents = async (privateAccess: boolean): Promise<EventsObject> => {
    const calendarCacheId = '61b335996165305292000383';
    const events = await getParishEvents({public: !privateAccess}).catch(() => null);
    if (events !== null) {
        if (!privateAccess && site(true, false)) {
            cockpit.collectionSave('internal-data', {
                _id: calendarCacheId,
                data: {events, cache: new Date().toISOString()}
            }).catch();
        }
        return {events, cache: null};
    } else {
        const cachedEvents = await cockpit.collectionGet('internal-data', {filter: {_id: calendarCacheId}});
        await notifyAdmin('Google Calendar failed');
        return cachedEvents.entries[0].data;
    }
}