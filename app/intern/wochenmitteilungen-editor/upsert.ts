"use server"

import {cockpit} from "@/util/cockpit-sdk";

export async function upsertWeekly(name: string, start: string, end: string, data: any) {
  const weeklyWithSameName =
    await cockpit.collectionGet("weekly_v2", {filter: { name }})
      .then(({entries}) => entries?.[0])
  await cockpit.collectionSave("weekly_v2", {
    _id: weeklyWithSameName?._id,
    name, start, end, data
  })
}

export async function markWeeklyAsSent(name: string) {
  const weeklyWithSameName =
    await cockpit.collectionGet("weekly_v2", {filter: { name }})
      .then(({entries}) => entries?.[0])
  if(!weeklyWithSameName) return
  await cockpit.collectionSave("weekly_v2", {
    _id: weeklyWithSameName?._id,
    sent: true
  })
}
