"use client";
import create from 'zustand';
import {fetchJson} from './fetch-util';
import {CalendarEvent} from "./calendar-types";
import {useEffect} from "react";
import {useUserStore} from "./use-user-store";

interface CalendarState {
    items: CalendarEvent[];
    cache?: string;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    load: (token?: string) => void;
    lastLoadedWithToken?: string;
}


export function useAuthenticatedCalendarStore() {
    const [jwt, userLoad] = useUserStore(state => [state.jwt, state.load]);
    const [load, loading, error, items] = useCalendarStore(state => [state.load, state.loading, state.error, state.items]);
    useEffect(() => {
        userLoad();
    }, []);
    useEffect(() => {
        if(jwt) load(jwt);
    }, [jwt]);
    return {loading, error, items};
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    items: [],
    loaded: false,
    loading: false,
    error: false,
    lastLoadedWithToken: 'none',
    load: (jwt?: string) => {
        if (get().loading && jwt === get().lastLoadedWithToken) return;
        if (get().loaded && jwt === get().lastLoadedWithToken) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/calendar', {jwt})
            .then(data => set(state => ({
                ...state,
                items: data.events,
                loaded: true,
                loading: false,
                error: false,
                cache: data.cache,
                lastLoadedWithToken: jwt
            })))
            .catch(() => {
                setTimeout(() => {
                    set(state => ({...state, loaded: false}));
                    get().load(jwt);
                }, 3000);
                set(state => ({...state, items: [], loaded: true, loading: false, error: true}));
            });
    }
}));