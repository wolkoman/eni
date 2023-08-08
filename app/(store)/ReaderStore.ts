import {createStore} from 'zustand';
import {Collections} from "cockpit-sdk";
import {combine} from "zustand/middleware";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {createLoadedStore} from "./CreateLoadedStore";
import {ReaderData} from "@/domain/service/Service";
import {fetchJson} from "@/app/(shared)/FetchJson";

export const useReaderStore = createLoadedStore(createStore(combine({
    readers: [] as Collections["person"][],
    communionMinisters: [] as Collections["person"][],
    readerData: {} as ReaderData,
    events: [] as CalendarEvent[],
    parish: CalendarName.EMMAUS,
    loading: false,
    loaded: false,
    error: false,
},(set, get) => ({
    setParish: (parish: CalendarName) => set({parish}),
    setReaderData: (x?: any) => {
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
}))));
