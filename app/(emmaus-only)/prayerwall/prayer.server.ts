"use server"
import {cockpit} from "../../../util/cockpit-sdk";
import {getPrayerSuggestion} from "../../../util/getCachedPrompt";

export async function submitPrayer(prayer: { name: string; concern: string }) {
  const suggestion = await getPrayerSuggestion(prayer.concern)
  await cockpit.collectionSave("prayers", {name: prayer.name, concern: prayer.concern, prayedCount: 0, publicPrayer: 0, blocked: false, suggestion})
}

export async function fetchPrayers() {
  return await cockpit.collectionGet("prayers", {filter: {blocked: false}}).then(e => e.entries)
}

export async function fetchPrayer(id: string) {
  return await cockpit.collectionGet("prayers", {filter: {blocked: false, _id: id}}).then(e => e.entries?.[0])
}
