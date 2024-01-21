"use client"

import {combine, persist} from "zustand/middleware";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {loadWeeklyEvents} from "./LoadWeeklyEvents";
import create from "zustand";
import {loadEvangelium} from "@/store/weeklyEditor/LoadEvangelium";
import {loadAnnouncements} from "@/app/intern/weekly/loadAnnouncements";
import {Collections} from "cockpit-sdk";

export const useWeeklyEditorStore = create(persist(combine({
    events: [] as CalendarEvent[],
    loaded: false,
    loading: false,
    evangelium: {place: "", text: ""},
    evangeliumLoad: Function,
    announcementLoad: Function,
    eventLoad: Function,
    announcements: [] as Collections["announcements"][],
    dateRange: {start: "", end: ""}
  }, (set, get) => ({
    setDateRange: (dateRange: ReturnType<typeof get>["dateRange"]) => {
      set({dateRange});
    },
    announcementLoad: () => {
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
    evangeliumLoad: () => {
      if (get().loading) return;
      set(state => ({...state, loading: true}));
      const start = new Date(get().dateRange.start)
      const nextSunday = new Date(start.getTime() + (start.getDay() ? 7-start.getDay() : 0) *3600*1000*24)
      loadEvangelium(nextSunday.toISOString().substring(0,10))
        .then(evangelium => {
          if (evangelium === null) return;
          set({
            evangelium,
            loading: false,
          });
        })
        .catch((error) => {
          console.log({error})
          set({loading: false});
        });
    },
    eventLoad: () => {
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
  })),
  {
    name: 'weekly-editor-storage',
  }));

