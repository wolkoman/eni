import {CalendarName} from "./calendar-info";
import {ReaderInfo, ReaderRole} from "./reader";
import {Collections} from "cockpit-sdk";

export interface CalendarEvent {
    id: string,
    summary: string,
    mainPerson: string | null,
    description: string,
    date: string,
    time: string | null,
    start: { dateTime: string },
    end: { dateTime: string },
    calendar: CalendarName,
    visibility: string,
    wholeday: boolean,
    groups: CalendarGroup[],
    tags: CalendarTag[],
    readerInfo: Partial<Record<ReaderRole, ReaderInfo>>
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
    singleEvent = 'singleEvent',
    suggestion = 'suggestion',
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
    Jugend = "Jugend",
    Gremien = "Gremien",
    Chor = "Chor",
    Karwoche = "Karwoche",
    Ostern = "Ostern",
    Fastenzeit = "Fastenzeit",
}