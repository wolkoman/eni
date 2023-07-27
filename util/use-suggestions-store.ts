import create from 'zustand';
import {fetchJson} from './fetch-util';
import {useEffect} from "react";
import {Collections} from "cockpit-sdk";
import {combine} from "zustand/middleware";

export function useAuthenticatedSuggestionsStore() {
    const state = useSuggestionsStore(state => state);
    useEffect(() => state.load(), []);
    return state;
}

export const useSuggestionsStore = create(combine(
    {loading: false, loaded: false, items: [] as Collections['eventSuggestion'][]},
    (set, get) => ({
        add: (suggestion: Collections['eventSuggestion']) => {
            set(({items}) => ({items: [...items, suggestion]}));
        },
        load: () => {
            if (get().loaded || get().loading) return;
            set({loading: true});
            fetchJson("/api/calendar/allSuggestions")
                .then((items: Collections['eventSuggestion'][]) => set({loaded: true, items}))
                .finally(() => set({loading: false}))
        }
    })
));

