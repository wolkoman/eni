import create from 'zustand';
import {CalendarEvent, CalendarEvents} from './calendar-events';
import {fetchJson} from './fetch-util';

export const useCalendarStore = create<{
    items: CalendarEvent[];
    groupByDate: (events: CalendarEvent[]) => Record<string, CalendarEvent[]>
    groupByDateAndGroup: (events: CalendarEvent[]) => Record<string,Record<string, CalendarEvent[]>>
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
    groupByDate: (events) => {
        return events.reduce<Record<string, CalendarEvent[]>>((record, event) => ({...record, [event.date]: [...(record[event.date] ?? []), event]}), {})
    },
    groupByDateAndGroup: (events) => {
        return Object.fromEntries(Object.entries(events.reduce<Record<string, CalendarEvent[]>>((record, event) => ({
                ...record,
                ...(Object.fromEntries(event.groups.map(group => ([
                    group,
                    [
                        ...(record[group] ?? []),
                        event
                    ]
                ]))))
            }), {})).map(([group, events]) => [group, get().groupByDate(events)]));
    },
    load: (jwt?: string) => {
        console.log("loaded",get().loaded)
        if (get().loading && jwt === get().lastLoadedWithToken) return;
        if (get().loaded && jwt === get().lastLoadedWithToken) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/calendar', {jwt})
            .then(data => set(state => ({
                ...state,
                items: data.events,
                loaded: true,
                loading: false,
                cache: data.cache,
                lastLoadedWithToken: jwt
            })))
            .catch(() => {
                set(state => ({...state, items: [], loaded: true, loading: false, error: true}));
            });
    }
}));