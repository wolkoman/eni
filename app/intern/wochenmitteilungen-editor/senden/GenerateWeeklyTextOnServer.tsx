"use server"

import {Collections} from "cockpit-sdk";
import {getEvangeliumSummary, getWeeklySummary} from "@/app/(shared)/ChatGpt";
import {loadWeeklyEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/LoadWeeklyEvents";
import {loadEvangelium} from "@/app/intern/wochenmitteilungen-editor/(announcements)/LoadEvangelium";

export async function generateWeeklyTextOnServer(weekly: Collections["weekly_v2"]) {
  const events = await loadWeeklyEvents(weekly.data.dateRange.start, weekly.data.dateRange.end)
  const items = weekly.data.items
    .filter(event => event.type !== "ARTICLE" || !event.title.includes("Evangelium"))
    .map(item => 'eventId' in item
      ? {...item, event: events.find(e => e.id === item.eventId)}
      : item
    )
  const evangelium = await loadEvangelium(new Date(weekly.data.dateRange.start));
  const texts = await Promise.all([
    await getEvangeliumSummary(evangelium),
    await getWeeklySummary(items.filter(item => item.parishes["emmaus"])),
    await getWeeklySummary(items.filter(item => item.parishes["inzersdorf"])),
    await getWeeklySummary(items.filter(item => item.parishes["neustift"])),
  ])
  return {
    evangelium: texts[0],
    emmaus: texts[1],
    inzersdorf: texts[2],
    neustift: texts[3],
  }
}
