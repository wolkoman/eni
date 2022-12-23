import create from 'zustand';
import {fetchJson} from './fetch-util';
import {Collections} from 'cockpit-sdk';
import {ReaderData} from "./reader";
import {useAuthenticatedUserStore} from "./use-user-store";
import {useEffect} from "react";
import {CalendarName} from "./calendar-info";
import {CalendarEvent} from "./calendar-types";

export function useAuthenticatedReaderStore() {
    const {user} = useAuthenticatedUserStore();
    const store = useReaderStore(state => state);
    useEffect(() => {
        if (user?.parish && user.parish !== CalendarName.ALL) store.setParish(user.parish);
    }, [user?.parish]);
    useEffect(() => {
        if (!store.loaded) store.load();
    }, [store.loaded])
    return {
        loading: store.loading,
        error: store.error,
        readers: store.readers,
        readerData: store.readerData,
        setReaderData: store.setReaderData,
        parish: store.parish,
        setParish: store.setParish,
        events: store.events
    };
}

export const useReaderStore = create<{
    readers: Collections["person"][];
    readerData: ReaderData;
    events: CalendarEvent[],
    parish: CalendarName;
    setParish: (calendar: CalendarName) => void;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    setReaderData: (x?: any) => void;
    load: (token?: string) => void;
}>((set, get) => ({
    readers: [],
    events: [],
    readerData: {},
    loaded: false,
    loading: false,
    error: false,
    parish: CalendarName.EMMAUS,
    setParish: (parish) => set({parish}),
    setReaderData: (x) => {
        set(data => ({
            ...data,
            readerData: {...data.readerData, ...x}
        }))
    },
    load: () => {
        if (get().loading) return;
        if (get().loaded) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/reader')
            .then(data => set(state => ({
                ...state,
                loading: false,
                loaded: true,
                readerData: data.readerData,
                readers: data.readers,
                events: data.events,
            })))
            .catch(() => {
                setTimeout(() => {
                    set(state => ({...state, loaded: false}));
                    get().load();
                }, 3000);
                set({loaded: true, loading: false, error: true});
            });
    }
}));