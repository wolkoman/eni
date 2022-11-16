import {calendar_v3, google} from 'googleapis';
import {cockpit} from './cockpit-sdk';
import {site} from "./sites";
import {notifyAdmin} from "./telegram";
import {getTimeOfEvent} from "./get-time-of-event";
import {CALENDAR_INFOS, CalendarName} from "./calendar-info";
import {CalendarEvent, CalendarGroup, CalendarTag, EventsObject} from "./calendar-types";

const notInChurchRegex = /(Pfarrgarten|Pfarrheim|Pfarrhaus|Friedhof|kirchenfrei)/gi;
const cancelledRegex = /(abgesagt|findet nicht statt|entfällt)/gi;

function getGroupFromEvent(event: any): CalendarGroup[] {
    let conditions: ((x: CalendarEvent) => CalendarGroup | false)[] = [
        x => x.summary.toLowerCase().includes("wallfahrt") && CalendarGroup.Wallfahrt,
        x => x.summary.toLowerCase().startsWith("taufe") && CalendarGroup.Taufe,
        x => x.summary.toLowerCase().startsWith("grabwache") && CalendarGroup.Grabwache,
        x => x.summary.toLowerCase().includes("messe") && CalendarGroup.Messe,
        x => x.summary.toLowerCase().includes("mette") && CalendarGroup.Messe,
        x => x.summary.includes("Firmung") && CalendarGroup.Messe,
        x => x.summary.toLowerCase().includes("jungschar") && CalendarGroup.Jungschar,
        x => x.summary.toLowerCase().includes("evangel") && CalendarGroup.Ökumene,
        x => x.summary.toLowerCase().startsWith("friedensgebet") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("emmausgebet") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("rosenkranz") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("gebetsrunde") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("bibelrunde") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("bibelgespräch") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("bibelkreis") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("glaubensabend") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("friedhofsgang") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("sprechstunde mit jesus") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("maiandacht") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("klimaoase") && CalendarGroup.Caritas,
        x => x.summary.toLowerCase().includes("eltern-kind-treff") && CalendarGroup.Kinder,
        x => x.summary.toLowerCase().includes("mädchenabend") && CalendarGroup.Kinder,
        x => x.summary.toLowerCase().includes("ministrantenstunde") && CalendarGroup.Kinder,
        x => x.summary.toLowerCase().startsWith("kinderstunde") && CalendarGroup.Kinder,
        x => x.summary.toLowerCase().includes("ferienspiel") && CalendarGroup.Kinder,
        x => x.summary.toLowerCase().includes("hl. martin") && CalendarGroup.Kinder,
        x => x.summary.toLowerCase().includes("jugendtreffen") && CalendarGroup.Jugend,
        x => x.summary.toLowerCase().startsWith("plauder") && CalendarGroup.Gemeinschaft,
        x => x.summary.toLowerCase().includes("workshop") && CalendarGroup.Gemeinschaft,
        x => x.summary.toLowerCase().includes("flohmarkt") && CalendarGroup.Gemeinschaft,
        x => x.summary.toLowerCase().includes("50+ treff") && CalendarGroup.Gemeinschaft,
        x => x.summary.toLowerCase().startsWith("bibel aktiv") && CalendarGroup.Gebet,
        x => x.summary.toLowerCase().includes("andacht") && CalendarGroup.Gottesdienst,
        x => x.summary.toLowerCase().startsWith("vesper") && CalendarGroup.Gottesdienst,
        x => x.summary.toLowerCase().includes("worship") && CalendarGroup.Gottesdienst,
        x => x.summary.toLowerCase().includes("anbetung") && CalendarGroup.Gottesdienst,
        x => x.summary.toLowerCase().includes("wortgottesfeier") && CalendarGroup.Gottesdienst,
        x => x.summary.toLowerCase().includes("gottesdienst") && !x.summary.toLowerCase().includes("evang") && CalendarGroup.Gottesdienst,
        x => x.summary.toLowerCase().includes("nikolaus") && CalendarGroup.Advent,
        x => x.summary.toLowerCase().includes("advent") && CalendarGroup.Advent,
        x => x.summary.toLowerCase().includes("rorate") && CalendarGroup.Advent,
        x => x.summary.toLowerCase().includes("krippenspiel") && CalendarGroup.Weihnachten,
        x => x.summary.toLowerCase().includes("mette") && CalendarGroup.Weihnachten,
        x => x.summary.toLowerCase().includes("mette") && CalendarGroup.Weihnachten,
        x => x.summary.toLowerCase().includes("taufe") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes(" ehe") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes("firmvorbereitung") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes("priesternotruf") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes("junschar") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes("krankenbesuche") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes("motorrad") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes("generalprobe") && CalendarGroup.Invisible,
        x => x.summary.toLowerCase().includes("sitzung") && CalendarGroup.Gremien,
        x => x.summary.toLowerCase().includes("pfarrgemeinderat") && CalendarGroup.Gremien,
        x => x.summary.toLowerCase().includes("chor") && CalendarGroup.Chor,
        x => x.summary.toLowerCase().includes("sprechstunde") && CalendarGroup.Sprechstunde,
        x => x.summary.toLowerCase().includes("woche des lebens") && CalendarGroup.Kinder,
        x => x.summary.toLowerCase().includes("erstkommunion") && CalendarGroup.Sakramente,
        x => x.summary.toLowerCase().includes("firmkurs") && CalendarGroup.Sakramente,
    ];
    let groups = conditions.reduce<(CalendarGroup | false)[]>((groups, condition) => [
        ...groups,
        condition(event)
    ], [])
        .filter((group): group is CalendarGroup => !!group);

    if (groups.length === 0 && event.visibility !== "private") {
        notifyAdmin(`unknown event group: ${event.summary} ${JSON.stringify(event.start)}`);
    }

    return groups.filter(group => group !== CalendarGroup.Invisible);
}


export function mapGoogleEventToEniEvent(calendarName: CalendarName): (event: calendar_v3.Schema$Event) => CalendarEvent {
    return (event): CalendarEvent => {
        const displayPersonen = event?.summary?.split("/", 2)?.[1] ?? null;
        return ({
            id: event.id ?? "",
            summary: event?.summary?.split('/', 2)[0] ?? "",
            mainPerson: displayPersonen,
            description: event.description ?? '',
            date: (event.start?.date ?? event.start?.dateTime ?? '').substr(0, 10),
            start: event.start as {dateTime: string},
            end: event.end as {dateTime: string},
            calendar: calendarName,
            visibility: event.visibility ?? 'public',
            groups: getGroupFromEvent(event),
            tags: [
                !(event.summary + (event.description ?? '')).match(notInChurchRegex) && CalendarTag.inChurch,
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
/*
        if (!privateAccess && site(true, false)) {
            cockpit.collectionSave('internal-data', {
                _id: calendarCacheId,
                data: {events, cache: new Date().toISOString()}
            }).catch();
        }
*/
        return {events, cache: null};
    } else {
        const cachedEvents = await cockpit.collectionGet('internal-data', {filter: {_id: calendarCacheId}});
        await notifyAdmin('Google Calendar failed');
        return cachedEvents.entries[0].data;
    }
}