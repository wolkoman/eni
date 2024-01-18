"use client"

import {combine, persist} from "zustand/middleware";
import {CalendarEvent} from "@/domain/events/EventMapper";
import {loadWeeklyEvents} from "./LoadWeeklyEvents";
import create from "zustand";
import {Dispatch, SetStateAction} from "react";

export const useWeeklyEditorStore = create(persist(combine({
    events: [] as CalendarEvent[],
    loaded: false,
    loading: false,
    load: Function,
    dateRange: {start: "", end: ""}
  }, (set, get) => ({
    setDateRange: (dateRange: ReturnType<typeof get>["dateRange"]) => {
      set({dateRange});
    },
    load: () => {
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

