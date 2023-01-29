import {CalendarName} from "./calendar-info";
import {ReaderInfo} from "./reader";
import {Collections} from "cockpit-sdk";

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
    tags: CalendarTag[],
    readerInfo: {reading1?: ReaderInfo, reading2?: ReaderInfo}
}

export interface CalendarEventWithSuggestion extends CalendarEvent{
    suggestion?: boolean
}

export interface EventsObject {
    events: CalendarEvent[];
    openSuggestions: Collections['eventSuggestion'][]
    cache?: string;
}

export enum CalendarTag {
    inChurch = "in-church",
    private = 'private',
    cancelled = 'cancelled',
    announcement = 'announcement',
    recurring = 'recurring',
}

export enum CalendarGroup {
    Wallfahrt = "Wallfahrt",
    Grabwache = "Grabwache",
    Messe = "Heilige Messe",
    Gebet = "Gebet & Bibel",
    Caritas = "Caritas",
    Kinder = "Kinder",
    Sakramente = "Sakramente",
    Gemeinschaft = "Gemeinschaft",
    Gottesdienst = "Gottesdienst",
    Weihnachten = "Weihnachten",
    Advent = "Advent",
    Invisible = "_",
    Sprechstunde = "Sprechstunde",
    Jugend = "Jugend",
    Gremien = "Gremien",
    Chor = "Chor",
    Karwoche = "Karwoche",
    Ostern = "Ostern",
    Fastenzeit = "Fastenzeit",
}