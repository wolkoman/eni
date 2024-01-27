"use server"

import {Cockpit} from "@/util/cockpit";
import {spotifyAuthHeader, spotifyRecordId} from "@/app/(emmaus-only)/fiesta/login/route";
import create from "zustand";

export default async function getSpotifyQueue(){
  const {entries: [{data: credentials}]} = await Cockpit.collectionGetCached("internal-data", {filter: {_id: spotifyRecordId}})


  const data = await fetch("https://api.spotify.com/v1/me/player/queue", {
    headers: {
      Authorization: "Bearer " + credentials.access_token
    }
  })
    .then(response => response.json());
  if("error" in data){
    const body = await fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: spotifyAuthHeader
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: credentials.refresh_token,
      }),
    }).then(x => x.json());
    await Cockpit.collectionSave("internal-data", {_id: spotifyRecordId, data: body});
    return {}
  }
  return {currently_playing: data.currently_playing, queue: data.queue.slice(0,4)}
}