import create from 'zustand';
import {useEffect} from "react";
import {combine} from "zustand/middleware";
import {Collections} from "cockpit-sdk";
import {getAllSuggestionFromServer} from "./use-suggestion-store.server";

export function useAuthenticatedSuggestionsStore() {
    const state = useSuggestionsStore(state => state);
    useEffect(() => state.load(), []);
    return state;
}

export const useSuggestionsStore = create(combine(
    {
      loading: false,
      loaded: false,
      items: [] as Collections['eventSuggestion'][]
    },
    (set, get) => ({
        add: (suggestion: Collections['eventSuggestion']) => {
            set(({items}) => ({items: [...items, suggestion]}));
        },
        load: () => {
            if (get().loaded || get().loading) return;
            set({loading: true});
            getAllSuggestionFromServer()
                .then((items: Collections['eventSuggestion'][]) => set({loaded: true, items}))
                .finally(() => set({loading: false}))
        }
    })
));

