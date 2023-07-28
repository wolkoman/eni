import create from 'zustand';
import {fetchJson} from '../fetch-util';
import {useEffect} from "react";
import {Collections} from "cockpit-sdk";
import {combine} from "zustand/middleware";
import {CalendarEvent, EventsObject} from "../../app/termine/EventMapper";
import {CalendarGroup} from "../../app/termine/CalendarGroup";

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

export function useAuthenticatedCalendarStore() {
    const state = useCalendarStore(state => state);
    useEffect(() => {
        state.load();
    }, []);
    return state;
}

export const useCalendarStore = create(combine({
    items: [] as CalendarEvent[],
    originalItems: [] as CalendarEvent[],
    openSuggestions: [] as Collections["eventSuggestion"][],
    loaded: false,
    loading: false,
    error: false,
    cache: undefined as string | undefined,
    lastLoadedWithToken: 'none',
},(set, get) => ({
    load: () => {
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
                    // set(state => ({...state, loaded: false}));
                    // get().load(userId);
                }, 3000);
                set({items: [], loaded: true, loading: false, error: true});
            });
    },
    addSuggestion: (suggestion: Collections["eventSuggestion"]) => {
        const newOpenSuggestions = [...get().openSuggestions.filter(sug => sug.eventId !== suggestion.eventId), suggestion];
        set({
            openSuggestions: newOpenSuggestions
        });
    },
    removeSuggestion: (suggestionId: string) => {
        set(({openSuggestions}) => ({
                openSuggestions: openSuggestions.filter(suggestion => suggestion._id !== suggestionId),
            })
        )
    }
})));

