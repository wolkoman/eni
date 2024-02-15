"use client"
import {v4 as uuidv4} from 'uuid';
import {combine, persist} from "zustand/middleware";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {loadWeeklyEvents} from "./LoadWeeklyEvents";
import create from "zustand";
import {loadAnnouncements} from "@/app/intern/weekly/loadAnnouncements";
import {Collections} from "cockpit-sdk";
import {loadEvangelium} from "@/app/intern/weekly-editor/LoadEvangelium";
import {CalendarName} from "@/domain/events/CalendarInfo";

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

export const useWeeklyEditorStore = create(persist(combine({
    events: [] as CalendarEvent[],
    loaded: false,
    loading: false,
    items: [] as WeeklyParishItem[],
    switchSideFor: [] as {parish: CalendarName, id: string}[],
    hideDescriptionForIds: [] as string[],
    announcements: [] as Collections["announcements"][],
    dateRange: {start: "", end: ""}
  }, (set, get) => ({
    setDateRange: (dateRange: ReturnType<typeof get>["dateRange"]) => {
      set({dateRange});
    },
    loadAnnouncements: () => {
      if (get().loading) return;
      set(state => ({...state, loading: true}));
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
    insertEvangelium: () => {
      if (get().loading) return;
      set(state => ({...state, loading: true}));
      const start = new Date(get().dateRange.start)
      const nextSunday = new Date(start.getTime() + (start.getDay() ? 7 - start.getDay() : 0) * 3600 * 1000 * 24)
      loadEvangelium(nextSunday.toISOString().substring(0, 10))
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
    toggleDescriptionFor(id: string) {
      const list = get().hideDescriptionForIds;
      set({hideDescriptionForIds: [...list.filter(item => item !== id), ...(list.includes(id) ? [] : [id])]})
    },
    toggleSideFor(id: string, parish: CalendarName) {
      const list = get().switchSideFor;
      type T = {parish: CalendarName, id: string}
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

