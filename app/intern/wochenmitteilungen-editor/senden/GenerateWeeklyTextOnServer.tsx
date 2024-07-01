"use server"

import {Collections} from "cockpit-sdk";
import {getEvangeliumSummary, getWeeklySlogan, getWeeklySummary} from "@/app/(shared)/ChatGpt";
import {loadWeeklyEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/LoadWeeklyEvents";
import {loadEvangelium} from "@/app/intern/wochenmitteilungen-editor/(announcements)/LoadEvangelium";

export async function generateWeeklyTextOnServer(weekly: Collections["weekly_v2"]) {
  const events = await loadWeeklyEvents(weekly.data.dateRange.start, weekly.data.dateRange.end)
  const parishItems = weekly.data.items
    .map(item => 'eventId' in item
      ? {...item, event: events.find(e => e.id === item.eventId)}
      : item
    )
      .filter(item => !(item.type === "ARTICLE" && item.title.includes("Evangelium")))
  const evangeliumItems = weekly.data.items
    .filter(item => item.type === "ARTICLE" && item.title.includes("Evangelium"))
  const evangelium = await loadEvangelium(new Date(weekly.data.dateRange.start));
  const texts = await Promise.all([
    await getEvangeliumSummary(evangeliumItems),
    await getWeeklySummary(parishItems),
    await getWeeklySlogan(evangelium),
  ])
  return {
    evangelium: texts[0],
    parish: texts[1],
    slogan: texts[2],
  }
}
