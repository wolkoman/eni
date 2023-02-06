import create from 'zustand';
import {fetchJson} from './fetch-util';
import {CalendarEvent, CalendarGroup, EventsObject} from "./calendar-types";
import {useEffect} from "react";
import {useAuthenticatedUserStore} from "./use-user-store";
import {Collections} from "cockpit-sdk";

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

interface CalendarState {
    items: CalendarEvent[];
    originalItems: CalendarEvent[];
    cache?: string;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    openSuggestions: Collections["eventSuggestion"][];
    load: (userId: string) => void;
    addSuggestion: (suggestion: Collections["eventSuggestion"], userId: string) => void;
    answerSuggestion: (suggestionId: string, accept: boolean) => void

}


export function useAuthenticatedCalendarStore() {
    const {user} = useAuthenticatedUserStore();
    const state = useCalendarStore(state => state);
    useEffect(() => {
        if (user) state.load(user._id);
    }, [user]);
    return state;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    items: [],
    originalItems: [],
    openSuggestions: [],
    loaded: false,
    loading: false,
    error: false,
    lastLoadedWithToken: 'none',
    load: (userId: string) => {
        if (get().loading) return;
        if (get().loaded) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/calendar', {})
            .then((data: EventsObject) => set({
                items: data.events,
                openSuggestions: data.openSuggestions,
                originalItems: data.events,
                loaded: true,
                loading: false,
                error: false,
                cache: data.cache,
            }))
            .catch((err) => {
                console.log({err})
                setTimeout(() => {
                    set(state => ({...state, loaded: false}));
                    get().load(userId);
                }, 3000);
                set({items: [], loaded: true, loading: false, error: true});
            });
    },
    addSuggestion: (suggestion: Collections["eventSuggestion"], userId) => {
        const newOpenSuggestions = [...get().openSuggestions.filter(sug => sug.eventId !== suggestion.eventId), suggestion];
        set({
            openSuggestions: newOpenSuggestions
        });
    },
    answerSuggestion: (suggestionId, accept) => {
        set(({openSuggestions}) => ({
                openSuggestions: openSuggestions.filter(suggestion => suggestion._id !== suggestionId),
            })
        )
    }
}));

