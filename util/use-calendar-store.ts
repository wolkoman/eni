import create from 'zustand';
import {CalendarEvent, CalendarEvents} from './calendar-events';
import {fetchJson} from './fetch-util';

export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
    return events.reduce<Record<string, CalendarEvent[]>>((record, event) => ({
        ...record,
        [event.date]: [...(record[event.date] ?? []), event]
    }), {});
}

export function groupEventsByDateAndGroup(events: CalendarEvent[]): Record<string, Record<string, CalendarEvent[]>> {
    return Object.fromEntries(Object.entries(events.reduce<Record<string, CalendarEvent[]>>((record, event) => ({
        ...record,
        ...(Object.fromEntries(event.groups.map(group => ([
            group,
            [
                ...(record[group] ?? []),
                event
            ]
        ]))))
    }), {})).map(([group, events]) => [group, groupEventsByDate(events)]))
}

export const useCalendarStore = create<{
    items: CalendarEvent[];
    cache?: string;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    load: (token?: string) => void;
    lastLoadedWithToken?: string,
}>((set, get) => ({
    items: [],
    loaded: false,
    loading: false,
    error: false,
    lastLoadedWithToken: 'none',
    load: (jwt?: string) => {
        if (get().loading && jwt === get().lastLoadedWithToken) return;
        if (get().loaded && jwt === get().lastLoadedWithToken) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/calendar', {jwt})
            .then(data => set(state => ({
                ...state,
                items: data.events,
                loaded: true,
                loading: false,
                error: false,
                cache: data.cache,
                lastLoadedWithToken: jwt
            })))
            .catch(() => {
                setTimeout(() => {
                    set(state => ({...state, loaded: false}));
                    get().load(jwt);
                }, 3000);
                set(state => ({...state, items: [], loaded: true, loading: false, error: true}));
            });
    }
}));