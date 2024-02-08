"use client"
import {SpotifyTrack, useSpotifyStore} from "@/app/(emmaus-only)/fiesta/store";
import React, {useEffect} from "react";
import Link from "next/link";

function findImage(track: SpotifyTrack) {
  return track.album.images.find(i => i.width < 500)?.url;
}

export function FiestaClientPage() {
  const store = useSpotifyStore(state => state);
  useEffect(() => {
    store.initial()
    store.load()
    const interval = setInterval(() => store.load(), 1000);
    return () => clearInterval(interval);
  }, [])

  const current = store?.data?.currently_playing;

  return <div className="bg-black text-white min-h-[100vh]">
    <meta name="theme-color" content="black"/>
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between  mb-12">
        <div className="text-white/80 font-bold text-2xl">FIESTA LATINA</div>
        <Link href="fiesta/wunsch">
          <div className="bg-emmaus-sec text-black rounded px-4 py-2">Musikwunsch</div>
        </Link>
      </div>

      <div className="my-12 text-3xl font-bold">
        {store.info.text.split("\n").map((text,index) => <div key={index} children={text}/> )}
      </div>
      {current && <>
          <div className="opacity-50 mb-2">Im Moment hören wir</div>
        <div className="flex gap-4 items-center overflow-hidden rounded-lg relative">
              <img className="w-full h-full blur-3xl absolute inset-0" src={findImage(current)} alt="Album Cover"/>
              <img className="h-32 rounded relative" src={findImage(current)} alt="Album Cover"/>
              <div className="relative">
                  <div className="text-3xl font-bold">{current.name}</div>
                  <div className="italic">{current.artists.map(x => x.name).join(", ")}</div>
              </div>
          </div>

          <div className="opacity-50 mt-8 mb-2">Als nächstes</div>
          <div className="grid grid-cols-2 gap-4">
            {store.data.queue.map(track => <div key={track.uri} className="p-4 border border-white/20 rounded">
              <div className="font-semibold">{track.name}</div>
              <div className="italic text-sm">{track.artists.map(x => x.name).join(", ")}</div>
            </div>)}
          </div>

      </>}
    </div>
  </div>
}