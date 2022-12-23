import create, {StoreApi, UseBoundStore} from 'zustand';
import {fetchJson} from './fetch-util';
import {CalendarEvent, CalendarGroup} from "./calendar-types";
import {useEffect} from "react";
import {useAuthenticatedUserStore, useUserStore} from "./use-user-store";

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

interface CalendarState {
    items: CalendarEvent[];
    cache?: string;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    load: () => void;
    lastLoadedWithToken?: string;
}


export function useAuthenticatedCalendarStore() {
    const {user} = useAuthenticatedUserStore();
    const [load, loading, error, items, loaded] = useCalendarStore(state => [state.load, state.loading, state.error, state.items, state.loaded]);
    useEffect(() => {
        if(user) load();
    }, [user]);
    return {loading, error, items, loaded};
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    items: [],
    loaded: false,
    loading: false,
    error: false,
    lastLoadedWithToken: 'none',
    load: () => {
        if (get().loading) return;
        if (get().loaded) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/calendar', {})
            .then(data => set(state => ({
                ...state,
                items: data.events,
                loaded: true,
                loading: false,
                error: false,
                cache: data.cache,
            })))
            .catch(() => {
                setTimeout(() => {
                    set(state => ({...state, loaded: false}));
                    get().load();
                }, 3000);
                set(state => ({...state, items: [], loaded: true, loading: false, error: true}));
            });
    }
}));