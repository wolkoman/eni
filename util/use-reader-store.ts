import create from 'zustand';
import {fetchJson} from './fetch-util';
import {Collections} from 'cockpit-sdk';
import {ReaderData} from "./reader";
import {useAuthenticatedUserStore} from "./use-user-store";
import {useEffect} from "react";
import {CalendarName} from "./calendar-info";
import {CalendarEvent} from "./calendar-types";
import {useAuthenticatedCalendarStore, useCalendarStore} from "./use-calendar-store";

export function useAuthenticatedReaderStore() {
    const {user} = useAuthenticatedUserStore();
    const {items: events} = useAuthenticatedCalendarStore();
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
        communionMinisters: store.communionMinisters,
        readerData: store.readerData,
        setReaderData: store.setReaderData,
        parish: store.parish,
        setParish: store.setParish,
        events: store.events,
        readerCount: store.getReaderCount(events)
    };
}

export const useReaderStore = create<{
    readers: Collections["person"][];
    communionMinisters: Collections["person"][];
    readerData: ReaderData;
    events: CalendarEvent[],
    parish: CalendarName;
    setParish: (calendar: CalendarName) => void;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    setReaderData: (x?: any) => void;
    load: (token?: string) => void;
    getReaderCount: (events: CalendarEvent[]) => { name: string, count: number, id: string }[]
}>((set, get) => ({
    readers: [],
    communionMinisters: [],
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
                readers: (<Collections['person'][]>data.readers).filter(person => person.competences.includes('reader')),
                communionMinisters: (<Collections['person'][]>data.readers).filter(person => person.competences.includes('communion_minister')),
                events: data.events,
            })))
            .catch(() => {
                setTimeout(() => {
                    set(state => ({...state, loaded: false}));
                    get().load();
                }, 3000);
                set({loaded: true, loading: false, error: true});
            });
    },
    getReaderCount(events: CalendarEvent[]){
        return Object.entries(Object.entries(get().readerData)
            .map(([id2, data]) => ({date: events.find(({id}) => id === id2)?.date, data}))
            .filter(({date}) => date)
            .flatMap((({data}) => [data.reading1?.id, data.reading2?.id]))
            .filter(data => data)
            .reduce<Record<string, number>>(
                (p, c) => ({...p, [c]: p[c] + 1}),
                Object.fromEntries(get().readers.map(person => [person._id, 0]))
            )
        ).map(([id, count]) => ({
            id,
            count,
            name: get().readers.find(({_id}) => _id === id)?.name,
        })) as { name: string, count: number, id: string }[]
    }
}));