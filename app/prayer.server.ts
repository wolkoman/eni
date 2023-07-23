"use server"
import {cockpit} from "../util/cockpit-sdk";

export async function submitPrayer(prayer: { name: string; concern: string }) {
  await cockpit.collectionSave("prayers", {name: prayer.name, concern: prayer.concern, prayedCount: 0, publicPrayer: 0, blocked: false})
}

export async function fetchPrayers() {
  return await cockpit.collectionGet("prayers", {filter: {blocked: false}}).then(e => e.entries)
}