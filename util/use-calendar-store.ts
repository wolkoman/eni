import create from 'zustand';
import {fetchJson} from './fetch-util';
import {CalendarEvent, CalendarEventWithSuggestion, CalendarGroup, EventsObject} from "./calendar-types";
import {useEffect} from "react";
import {useAuthenticatedUserStore} from "./use-user-store";
import {Collections} from "cockpit-sdk";

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

interface CalendarState {
    items: CalendarEventWithSuggestion[];
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
                items: mergeEventsWithSuggestions(data.events, data.openSuggestions, userId),
                openSuggestions: data.openSuggestions,
                originalItems: data.events,
                loaded: true,
                loading: false,
                error: false,
                cache: data.cache,
            }))
            .catch(() => {
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
            items: mergeEventsWithSuggestions(get().originalItems, newOpenSuggestions, userId),
            openSuggestions: newOpenSuggestions
        });
    },
    answerSuggestion: (suggestionId, accept) => {
        const suggestion = get().openSuggestions.find(suggestion => suggestion._id === suggestionId)!;
        const apply = (events: CalendarEvent[]) => events.map(event => event.id === suggestion.eventId && accept
            ? {...applySuggestion(event, suggestion), suggestion: undefined}
            : event)
        set(({items, openSuggestions, originalItems}) => ({
                openSuggestions: openSuggestions.filter(suggestion => suggestion._id !== suggestionId),
                items: apply(items),
                originalItems: apply(originalItems)
            })
        )
    }
}));

function mergeEventsWithSuggestions(events: CalendarEvent[], suggestions: Collections["eventSuggestion"][], userId: string): CalendarEventWithSuggestion[] {
    return events
        .map(event => ({event, suggestion: suggestions.find(suggestion => suggestion.eventId === event.id)}))
        .map(({event, suggestion}) => suggestion?.by === userId ? applySuggestion(event, suggestion) : {
            ...event,
            suggestion: suggestion ? undefined : undefined
        })
}

export function applySuggestion(event: CalendarEvent, suggestion: Collections["eventSuggestion"]) {
    return {
        ...event,
        summary: suggestion.data.summary,
        description: suggestion.data.description,
        date: suggestion.data.date,
        start: {dateTime: `${suggestion.data.date}T${suggestion.data.time}:00`},
        suggestion: true
    }
}