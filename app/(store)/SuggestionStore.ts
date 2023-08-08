import {createLoadedStore} from "./CreateLoadedStore";
import {createStore} from "zustand";
import {combine} from "zustand/middleware";
import {Collections} from "cockpit-sdk";
import {getAllSuggestionFromServer} from "../(domain)/suggestions/SuggestionsLoader";

export const useSuggestionStore = createLoadedStore(createStore(combine(
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
)));
