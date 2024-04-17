"use client"
import {v4 as uuidv4} from 'uuid';
import {combine, persist} from "zustand/middleware";
import {CalendarEvent} from "@/domain/events/EventMapper";
import create, {UseBoundStore} from "zustand";
import {loadAnnouncements} from "@/app/intern/wochenmitteilungen/loadAnnouncements";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {hideAnnouncement} from "@/app/intern/wochenmitteilungen/hideAnnouncement";
import {loadEvangelium} from "@/app/intern/wochenmitteilungen-editor/(announcements)/LoadEvangelium";
import {loadWeeklyEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/LoadWeeklyEvents";
import {markWeeklyAsSent, upsertWeekly} from "@/app/intern/wochenmitteilungen-editor/upsert";

export type WeeklyParishItem = Article | Teaser

interface GeneralItem {
  id: string,
  parishes: {
    [CalendarName.EMMAUS]: boolean,
    [CalendarName.INZERSDORF]: boolean,
    [CalendarName.NEUSTIFT]: boolean,
  }
}

export type Article = {
  type: "ARTICLE",
  title: string,
  author: string,
  text: string
} & GeneralItem
export type Teaser = {
  type: "TEASER",
  eventId: string,
  preText: string,
  postText: string
} & GeneralItem

export type WeeklyEditorStoreData = {
  events: CalendarEvent[],
  items: WeeklyParishItem[],
  customEventDescription: Record<string, string | null>,
  dateRange: {start: string, end: string, name: string},
  setCustomDescription: Function,
  switchSideFor: { parish: CalendarName, id: string }[]
}

export const useWeeklyEditorStore = create(persist(combine({
    events: [] as CalendarEvent[],
    loaded: false,
    loading: false,
    items: [] as WeeklyParishItem[],
    switchSideFor: [] as { parish: CalendarName, id: string }[],
    customEventDescription: {} as Record<string, string | null>,
    announcements: [] as Collections["announcements"][],
    dateRange: {start: "", end: "", name: ""},
    send: Function,
  }, (set, get) => ({
    setDateRange: (dateRange: ReturnType<typeof get>["dateRange"]) => {
      set({dateRange});
    },
    send: async () => {
      set({loading: true})
      await markWeeklyAsSent(get().dateRange.name).finally(() => set({loading: false}))
    },
    loadAnnouncements: () => {
      if (get().loading) return;
      set({loading: true});
      loadAnnouncements()
        .then(announcements => {
          if (announcements === null) return;
          set({announcements: announcements.entries, loading: false});
        })
        .catch((error) => {
          console.log({error})
          set({loading: false});
        });
    },
    upsert: async () => {
      set({loading: true})
      const data = Object.fromEntries(Object.entries(get()).filter(([key, value]) => typeof value != "function"))
      await upsertWeekly(get().dateRange.name, get().dateRange.start, get().dateRange.end, data)
      set({loading: false})
    },
    insertEvangelium: () => {
      if (get().loading) return;
      set(state => ({...state, loading: true}));
      loadEvangelium(new Date(get().dateRange.start))
        .then(evangelium => set({
          items: [...get().items, {
            type: "ARTICLE",
            id: uuidv4(),
            parishes: {emmaus: true, inzersdorf: true, neustift: true},
            title: "Evangelium vom Sonntag",
            text: evangelium.text,
            author: evangelium.place
          }],
          loading: false,
        }))
        .catch((error) => {
          console.log({error})
          set({loading: false});
        });
    },
    loadEvents: () => {
      if (get().loading) return;
      set(state => ({...state, loading: true}));
      loadWeeklyEvents(get().dateRange.start, get().dateRange.end)
        .then(events => {
          if (events === null) return;
          set({
            events: events,
            loaded: true,
            loading: false,
          });
        })
        .catch((error) => {
          console.log({error})
          set({events: [], loaded: true, loading: false});
        });
    },
    addItem(item: WeeklyParishItem) {
      set({items: [...get().items, {...item, id: uuidv4()} as any]})
    },
    removeItem(id: string) {
      set({items: get().items.filter(item => item.id !== id)})
    },
    removeAnnouncement(id: string) {
      set({announcements: get().announcements.filter(item => item._id !== id)})
      hideAnnouncement(id).then()
    },
    setCustomDescription(eventId: string, description: string | null) {
      const list = get().customEventDescription;
      set({customEventDescription: {...list, [eventId]: description}})
    },
    toggleSideFor(id: string, parish: CalendarName) {
      const list = get().switchSideFor;
      type T = { parish: CalendarName, id: string }
      const isEqual = (a: T) => a.id === id && a.parish === parish
      set({switchSideFor: [...list.filter(item => !isEqual(item)), ...(list.find(isEqual) ? [] : [{id, parish}])]})
    },
    setItem(item: WeeklyParishItem) {
      const index = get().items.findIndex(i => i.id === item.id) ?? 0
      set({items: [...get().items.slice(0, index), item, ...get().items.slice(index + 1)]})
    }
  })),
  {
    name: 'weekly-editor-storage',
  }));
