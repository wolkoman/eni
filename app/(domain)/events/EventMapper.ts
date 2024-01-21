import {calendar_v3} from "googleapis";
import {CalendarGroup} from "./CalendarGroup";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "./CalendarInfo";
import {getGroupFromEvent} from "@/domain/events/CalendarGroupResolver";
import {EventLoadAccess, EventLoadOptions} from "@/domain/events/EventLoadOptions";
import {ReaderInfo, ReaderRole} from "@/domain/service/Service";

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

function hidePrivateEventDetails(value: string | null | undefined, access: EventLoadAccess) {
  if(access === EventLoadAccess.PRIVATE_ACCESS){
    return value ?? '';
  }else if(access === EventLoadAccess.WEEKLY){
    return value?.replace(/\[.*?]/g, '')?.replace(/\{.*?}/g, '') ?? ''
  }else{
    return value?.replace(/\[.*?]/g, '')?.replace(/\{/g, '').replace(/}/g, '') ?? ''
  }
}

export function mapEvent(calendarName: CalendarName, options: EventLoadOptions): (event?: calendar_v3.Schema$Event) => CalendarEvent | null {
  return (event): CalendarEvent | null => {
    if (!event) return null;
    const mainPerson = event?.summary?.split("/", 2)?.[1]?.trim() ?? null;
    const summary = event?.summary?.split('/', 2)[0] ?? "";
    const privateAccess = options.access === EventLoadAccess.PRIVATE_ACCESS;
    if (event.visibility === 'private' && !privateAccess) return null;
    return {
      id: event.id ?? "",
      mainPerson,
      summary: hidePrivateEventDetails(summary, options.access),
      description: hidePrivateEventDetails(event.description, options.access),
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

