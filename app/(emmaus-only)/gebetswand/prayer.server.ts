"use server"
import {cockpit} from "../../../util/cockpit-sdk";
import {revalidatePath} from "next/cache";
import {getPrayerSuggestion} from "../../(shared)/ChatGpt";
import {notifyAdmin} from "../../(shared)/Telegram";

export async function submitPrayer(prayer: { name: string; concern: string }) {
  const suggestion = await getPrayerSuggestion(prayer.concern)
  await notifyAdmin(`New prayer from ${prayer.name}: ${prayer.concern}`)
  await cockpit.collectionSave("prayers", {name: prayer.name, concern: prayer.concern, prayedCount: 0, publicPrayer: "", blocked: false, suggestion})
}


export async function prayedFor(id: string) {
  const prayer = await cockpit.collectionGet("prayers", {filter: {blocked: false, _id: id}}).then(e => e.entries?.[0])
  await cockpit.collectionSave("prayers", {_id: id, prayedCount: +prayer.prayedCount + 1})
  revalidatePath(`/gebetswand/${prayer._id}`)
}


export async function fetchPrayers() {
  return await cockpit.collectionGet("prayers", {filter: {blocked: false}}).then(e => e.entries)
}

export async function fetchPrayer(id: string) {
  return await cockpit.collectionGet("prayers", {filter: {blocked: false, _id: id}}).then(e => e.entries?.[0])
}
