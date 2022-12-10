"use client";
import create from 'zustand';
import {fetchJson} from './fetch-util';
import {Collections} from 'cockpit-sdk';
import {ReaderData} from "./reader";
import {useUserStore} from "./use-user-store";
import {useEffect} from "react";
import {CalendarName} from "./calendar-info";
import {CalendarEvent} from "./calendar-types";

export function useAuthenticatedReaderStore() {
    const [jwt, user, userLoad] = useUserStore(state => [state.jwt, state.user, state.load]);
    const [load, loading, error, readers, readerData, events, setReaderData, parish, setParish] = useReaderStore(state => [state.load, state.loading, state.error, state.readers, state.readerData, state.events, state.setReaderData, state.parish, state.setParish]);
    useEffect(() => {
        userLoad();
    }, []);
    useEffect(() => {
        if (jwt) load(jwt);
    }, [jwt]);
    useEffect(() => {
        if (user?.parish && user.parish !== CalendarName.ALL) setParish(user.parish);
    }, [user?.parish]);
    return {loading, error, readers, readerData, setReaderData, parish, setParish, events};
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
    load: (jwt?: string) => {
        if (get().loading) return;
        if (get().loaded) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/reader', {jwt})
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
                    get().load(jwt);
                }, 3000);
                set({loaded: true, loading: false, error: true});
            });
    }
}));