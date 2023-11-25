import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";

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