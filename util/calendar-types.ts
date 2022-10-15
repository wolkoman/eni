import {CalendarName} from "./calendar-info";

export interface CalendarEvent {
    id: string,
    summary: string,
    mainPerson: string | null,
    description: string,
    date: string,
    start: { dateTime: string },
    end: { dateTime: string },
    calendar: CalendarName,
    visibility: string,
    wholeday: boolean,
    groups: CalendarGroup[],
    tags: CalendarTag[]
}

export interface EventsObject {
    events: CalendarEvent[];
    cache: string | null;
}

export enum CalendarTag {
    inChurch = "in-church",
    private = 'private',
    cancelled = 'cancelled',
}

export enum CalendarGroup {
    Wallfahrt = "Wallfahrt",
    Taufe = "Taufe",
    Grabwache = "Grabwache",
    Messe = "Heilige Messe",
    Jungschar = "Jungschar",
    Ökumene = "Ökumene",
    Gebet = "Gebet & Bibel",
    Caritas = "Caritas",
    Kinder = "Kinder",
    Sakramente = "Sakramente",
    Gemeinschaft = "Gemeinschaft",
    Gottesdienst = "Gottesdienst",
    Weihnachten = "Weihnachten",
    Invisible = "_",
    Sprechstunde = "Sprechstunde",
    Jugend = "Jugend",
    Gremien = "Gremien",
    Chor = "Chor",
}