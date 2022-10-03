import {calendar_v3, google} from 'googleapis';
import {cockpit} from './cockpit-sdk';
import {site} from "./sites";
import {notifyAdmin} from "./telegram";
import {getTimeOfEvent} from "./get-time-of-event";

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
    mainPerson: string | null,
    description: string,
    date: string,
    start: { dateTime: string },
    end: { dateTime: string },
    calendar: Calendar,
    visibility: string,
    wholeday: boolean,
    groups: string[],
    tags: ('in-church' | 'private' | 'cancelled' | 'liturgy')[]
}

export type CalendarEvents = Record<string, CalendarEvent[]>;

const notInChurchRegex = /(Pfarrgarten|Pfarrheim|Pfarrhaus|Friedhof|kirchenfrei)/gi;
const cancelledRegex = /(abgesagt|findet nicht statt)/gi;
const liturgyRegex = /(Messe|Rorate)/gi;

function getGroupFromEvent(event: any): string[] {
    let conditions: ((x: CalendarEvent) => string | false)[] = [
        x => x.summary.toLowerCase().includes("wallfahrt") && "Wallfahrt",
        x => x.summary.toLowerCase().startsWith("taufe") && "Taufe",
        x => x.summary.toLowerCase().startsWith("grabwache") && "Grabwache",
        x => x.summary.toLowerCase().includes("messe") && "Heilige Messe",
        x => x.summary.toLowerCase().includes("mette") && "Heilige Messe",
        x => x.summary.includes("Firmung") && "Heilige Messe",
        x => x.summary.toLowerCase().includes("jungschar") && "Jungschar",
        x => x.summary.toLowerCase().includes("evangel") && "Ökumene",
        x => x.summary.toLowerCase().startsWith("friedensgebet") && "Gebet & Bibel",
        x => x.summary.toLowerCase().startsWith("emmausgebet") && "Gebet & Bibel",
        x => x.summary.toLowerCase().includes("rosenkranz") && "Gebet & Bibel",
        x => x.summary.toLowerCase().startsWith("gebetsrunde") && "Gebet & Bibel",
        x => x.summary.toLowerCase().startsWith("bibelrunde") && "Gebet & Bibel",
        x => x.summary.toLowerCase().startsWith("sprechstunde mit jesus") && "Gebet & Bibel",
        x => x.summary.toLowerCase().includes("maiandacht") && "Maiandacht",
        x => x.summary.toLowerCase().includes("klimaoase") && "Caritas",
        x => x.summary.toLowerCase().includes("eltern-kind-treff") && "Kinder",
        x => x.summary.toLowerCase().includes("mädchenabend") && "Kinder",
        x => x.summary.toLowerCase().includes("ministrantenstunde") && "Kinder",
        x => x.summary.toLowerCase().startsWith("kinderstunde") && "Kinder",
        x => x.summary.toLowerCase().includes("ferienspiel") && "Kinder",
        x => x.summary.toLowerCase().includes("hl. martin") && "Kinder",
        x => x.summary.toLowerCase().includes("jugendtreffen") && "Jugend",
        x => x.summary.toLowerCase().startsWith("plauder") && "Gemeinschaft",
        x => x.summary.toLowerCase().includes("flohmarkt") && "Gemeinschaft",
        x => x.summary.toLowerCase().includes("50+ treff") && "Gemeinschaft",
        x => x.summary.toLowerCase().startsWith("bibel aktiv") && "Gebet & Bibel",
        x => x.summary.toLowerCase().includes("andacht") && "Gottesdienst",
        x => x.summary.toLowerCase().startsWith("vesper") && "Gottesdienst",
        x => x.summary.toLowerCase().includes("adventkranz") && "Advent",
        x => x.summary.toLowerCase().includes("krippenspiel") && "Weihnachten",
        x => x.summary.toLowerCase().includes("mette") && "Weihnachten",
        x => x.summary.toLowerCase().includes("worship") && "Gottesdienst",
        x => x.summary.toLowerCase().includes("gottesdienst") && !x.summary.toLowerCase().includes("evang") && "Gottesdienst",
        x => x.summary.toLowerCase().includes("taufe") && "_",
        x => x.summary.toLowerCase().includes(" ehe") && "_",
        x => x.summary.toLowerCase().includes("firmvorbereitung") && "_",
        x => x.summary.toLowerCase().includes("motorrad") && "_",
        x => x.summary.toLowerCase().includes("generalprobe") && "_",
        x => x.summary.toLowerCase().includes("sitzung") && "Gremien",
        x => x.summary.toLowerCase().includes("chor") && "Chorprobe",
        x => x.summary.toLowerCase().includes("sprechstunde") && "Sprechstunde",
        x => x.summary.toLowerCase().includes("woche des lebens") && "Kinder",
    ];
    let groups = conditions.reduce<(string | false)[]>((groups, condition) => [
        ...groups,
        condition(event)
    ], [])
        .filter((group): group is string => !!group);

    if (groups.length === 0 && event.visibility !== "private") {
        //notifyAdmin(`unknown event group: ${event.summary} ${JSON.stringify(event.start)}`);
    }

    return groups.length === 0 ? [event.summary] : groups.filter(group => group !== "_");
}


function mapGoogleEventToEniEvent(calendarName: string): (event: calendar_v3.Schema$Event) => CalendarEvent {
    return event => {
        const displayPersonen = event?.summary?.split("/", 2)?.[1] ?? null;
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
            groups: getGroupFromEvent(event),
            tags: [
                !(event.summary + (event.description ?? '')).match(notInChurchRegex) && 'in-church',
                (event.visibility === 'private') && 'private',
                (event.summary + (event.description ?? '')).match(cancelledRegex) && 'cancelled',
                event.summary?.match(liturgyRegex) && 'liturgy',
            ].filter(item => item),
            wholeday: !!event.start?.date,
        } as CalendarEvent);
    };
}

export async function getCalendarEvents(calendarId: string, calendarName: string, options: { public: boolean } | { timeMin: Date, timeMax: Date }): Promise<CalendarEvent[]> {
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

    return eventsList.data.items!.map(mapGoogleEventToEniEvent(calendarName)).filter(event => event.summary)
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
export function getParishEvents(props: { public: boolean }): Promise<CalendarEvent[]> {
    return Promise.all(
        Object.entries(calendarIds).filter(([, calendarId]) => site(
            [calendarIds.all, calendarIds.emmaus, calendarIds.inzersdorf, calendarIds.neustift],
            [calendarIds.all, calendarIds.emmaus]
        )
            .includes(calendarId))
            .map(([name, calendarId]) => getCalendarEvents(calendarId, name, {public: props.public}))
    )
        .then(eventList => eventList.flat())
        .then(events => events.filter(event => !!event))
        .then(events => events.sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b)));
}

export interface EventsObject {
    events: CalendarEvent[];
    cache: string | null;
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