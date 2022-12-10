import {CalendarEvent, CalendarGroup} from "./calendar-types";

export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
    return events.reduce<Record<string, CalendarEvent[]>>((record, event) => ({
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

export function groupEventsByGroupAndDate(events: CalendarEvent[], separateMass: boolean): Record<CalendarGroup, Record<string, CalendarEvent[]>> {
    return Object.fromEntries(Object.entries(
            groupEventsByGroup(events, separateMass)
        ).map(([group, events]) => [group, groupEventsByDate(events)])
    ) as Record<CalendarGroup, Record<string, CalendarEvent[]>>;
}