import {calendar_v3} from "googleapis";
import {ReaderData, ReaderInfo, ReaderRole} from "../../util/reader";
import {CalendarGroup, getGroupFromEvent} from "./CalendarGroup";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "./CalendarInfo";

const notInChurchRegex = /(Pfarrgarten|Pfarrheim|Pfarrhaus|Friedhof|kirchenfrei)/gi;
const cancelledRegex = /(abgesagt|findet nicht statt|entfällt)/gi;

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
  suggestion = 'suggestion',
}

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

export function mapEvent(calendarName: CalendarName, options: GetEventOptions): (event?: calendar_v3.Schema$Event) => CalendarEvent | null {
  return (event): CalendarEvent | null => {
    if (!event) return null;
    const mainPerson = event?.summary?.split("/", 2)?.[1]?.trim() ?? null;
    const summary = event?.summary?.split('/', 2)[0] ?? "";
    const privateAccess = options.permission === GetEventPermission.PRIVATE_ACCESS;
    if (event.visibility === 'private' && !privateAccess) return null;
    return {
      id: event.id ?? "",
      mainPerson,
      summary: privateAccess ? summary : summary.replace(/\[.*?]/g, ''),
      description: privateAccess ? event.description ?? '' : event.description?.replace(/\[.*?]/g, '') ?? '',
      date: (event.start?.date ?? event.start?.dateTime ?? '').substring(0, 10),
      start: event.start as { dateTime: string },
      time: event.start?.dateTime ? new Date(event.start.dateTime).toLocaleTimeString("de-AT", {timeZone: "Europe/Vienna"}).substring(0, 5) : null,
      end: event.end as { dateTime: string },
      calendar: calendarName,
      visibility: event.visibility ?? 'public',
      groups: (calendarName !== CalendarName.INZERSDORF_ORGAN
          ? () => getGroupFromEvent(event)
          : () => []
      )(),
      tags: [
        !(event.summary + (event.description ?? '')).match(notInChurchRegex) && privateAccess && CalendarTag.inChurch,
        event.visibility === 'private' && CalendarTag.private,
        (event.summary + (event.description ?? '')).match(cancelledRegex) && CalendarTag.cancelled,
        (event.description ?? '').toLowerCase().includes("[ankündigung]") && CalendarTag.announcement,
      ].filter((item): item is CalendarTag => !!item),
      wholeday: !!event.start?.date,
      readerInfo: {}
    };
  };
}

export enum GetEventPermission {
  PUBLIC = "PUBLIC",
  PRIVATE_ACCESS = "PRIVATE_ACCESS",
  READER = "READER",
}

export type GetEventOptions =
  { permission: GetEventPermission.PUBLIC }
  | {
  permission: GetEventPermission.PRIVATE_ACCESS,
  timeFrame?: { min: Date, max: Date },
  readerData?: ReaderData
}
  | { permission: GetEventPermission.READER, ids: string[] }
