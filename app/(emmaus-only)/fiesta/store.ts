import create from "zustand";
import {combine, persist} from "zustand/middleware";
import getSpotifyQueue from "@/app/(emmaus-only)/fiesta/queue";

export interface SpotifyTrack {
  name: string;
  artists: {name: string}[],
  uri: string,
  album: {images: {url: string, width: number}[]}
}

export const useSpotifyStore = create(persist(combine(
  {
    data: {} as {queue: SpotifyTrack[], currently_playing: SpotifyTrack},
    lastUpdated: 0,
    loading: false,
  }, (set, get) => ({
    initial(){
      set({loading: false})
    },
    async load(){
      if(get().lastUpdated + 1000 * 10 > new Date().getTime()) return;
      if(get().loading) return;
      set({loading: true});
      const data = await getSpotifyQueue().finally(() => set({loading: false}))
      set({loading: false, lastUpdated: new Date().getTime(), data})
    }
  })
), {name: "spotify-store"}))