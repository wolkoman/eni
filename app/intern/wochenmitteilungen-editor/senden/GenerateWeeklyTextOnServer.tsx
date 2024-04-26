"use server"

import {Collections} from "cockpit-sdk";
import {getEvangeliumSummary, getWeeklySlogan, getWeeklySummary} from "@/app/(shared)/ChatGpt";
import {loadWeeklyEvents} from "@/app/intern/wochenmitteilungen-editor/(events-page)/LoadWeeklyEvents";
import {loadEvangelium} from "@/app/intern/wochenmitteilungen-editor/(announcements)/LoadEvangelium";

export async function generateWeeklyTextOnServer(weekly: Collections["weekly_v2"]) {
  const events = await loadWeeklyEvents(weekly.data.dateRange.start, weekly.data.dateRange.end)
  const parishItems = weekly.data.items
    .filter(event => Object.values(event.parishes).filter(x => x).length == 1)
    .map(item => 'eventId' in item
      ? {...item, event: events.find(e => e.id === item.eventId)}
      : item
    )
  const allItems = weekly.data.items
    .filter(event => Object.values(event.parishes).filter(x => x).length == 3)
  const evangelium = await loadEvangelium(new Date(weekly.data.dateRange.start));
  const texts = await Promise.all([
    await getEvangeliumSummary(allItems),
    await getWeeklySummary(parishItems.filter(item => item.parishes["emmaus"])),
    await getWeeklySummary(parishItems.filter(item => item.parishes["inzersdorf"])),
    await getWeeklySummary(parishItems.filter(item => item.parishes["neustift"])),
    await getWeeklySlogan(evangelium),
  ])
  return {
    evangelium: texts[0],
    emmaus: texts[1],
    inzersdorf: texts[2],
    neustift: texts[3],
    slogan: texts[4],
  }
}
