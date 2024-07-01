import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {getGroupSorting} from "@/domain/events/CalendarGroupSorter";
import {CalendarName} from "@/domain/events/CalendarInfo";

export function groupEventsByDate<T extends CalendarEvent>(events: T[]): Record<string, T[]> {
  return events.reduce<Record<string, T[]>>((record, event) => ({
    ...record,
    [event.date]: [...(record[event.date] ?? []), event]
  }), {});
}

export function groupEventsByGroup(events: CalendarEvent[], separateMass: boolean): Record<CalendarGroup, CalendarEvent[]> {
  return events.reduce<Record<CalendarGroup, CalendarEvent[]>>((record, event) => ({
    ...record,
    ...(Object.fromEntries(event.groups
      .map(group => !separateMass && group === CalendarGroup.Messe ? CalendarGroup.Gottesdienst : group)
      .map(group => ([
        group,
        [
          ...(record[group] ?? []),
          event
        ]
      ]))))
  }), {} as any)
}

export function groupEventsByGroupAndDate(events: CalendarEvent[], separateMass: boolean): [string, Record<string, CalendarEvent[]>][] {
  return Object.entries(groupEventsByGroup(events, separateMass))
    .sort(([group1], [group2]) => getGroupSorting(group2 as CalendarGroup) - getGroupSorting(group1 as CalendarGroup))
    .map(([group, events]) => [group,
      groupEventsByDate([CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
        .flatMap(calendar => events
          .filter(event => event.calendar === calendar)
          .slice(0, 3)
        )
        .sort((b, a) => b.start.dateTime?.localeCompare(a.start.dateTime))
      )]);
}