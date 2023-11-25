"use client"

import {createStore} from 'zustand';
import {Collections} from "cockpit-sdk";
import {combine} from "zustand/middleware";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {loadEventsFromServer} from "@/domain/events/EventsLoader";
import {createLoadedStore} from "@/store/CreateLoadedStore";

export const useCalendarStore = createLoadedStore(createStore(combine({
    items: [] as CalendarEvent[],
    originalItems: [] as CalendarEvent[],
    openSuggestions: [] as Collections["eventSuggestion"][],
    loaded: false,
    loading: false,
    error: false,
    cache: undefined as string | undefined,
    lastLoadedWithToken: 'none',
    load: Function,
},(set, get) => ({
    load: () => {
        if (get().loading) return;
        if (get().loaded) return;
        set(state => ({...state, loading: true}));
        loadEventsFromServer(true)
            .then(data => {
                if(data === null) return;
                set({
                    items: data.events,
                    openSuggestions: data.openSuggestions,
                    originalItems: data.events,
                    loaded: true,
                    loading: false,
                    error: false,
                    cache: data.cache,
                });
            })
            .catch((error) => {
                console.log({error})
                setTimeout(() => {
                    set(state => ({...state, loaded: false}));
                    get().load();
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
}))));

