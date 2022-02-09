import create from 'zustand';
import {CalendarEvents} from './calendar-events';
import {fetchJson} from './fetch-util';

export const useCalendarStore = create<{
    items: CalendarEvents;
    cache?: string;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    load: (token?: string) => void;
    lastLoadedWithToken?: string,
}>((set, get) => ({
    items: {},
    loaded: false,
    loading: false,
    error: false,
    lastLoadedWithToken: 'none',
    load: (jwt?: string) => {
        if (get().loading || jwt === get().lastLoadedWithToken) return;
        set(state => ({...state, loading: true}));
        fetchJson('/api/calendar', {jwt})
            .then(data => set(state => ({
                ...state,
                items: data.events,
                loaded: true,
                loading: false,
                cache: data.cache,
                lastLoadedWithToken: jwt
            })))
            .catch(() => set(state => ({...state, items: {}, loaded: true, loading: false, error: true})));
    }
}));