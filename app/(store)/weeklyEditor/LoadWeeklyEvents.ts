"use server"

import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {CalendarTag} from "@/domain/events/EventMapper";

export async function loadWeeklyEvents(minString: string, maxString: string) {
  const min = new Date(minString), max = new Date(new Date(maxString).getTime() + 24*3600*1000);

  const {events} = await loadCachedEvents({
    access: EventLoadAccess.WEEKLY,
    timeFrame: {min, max}
  });
  return events
    .filter(event => !event.tags.includes(CalendarTag.private))
    .filter(event => !event.wholeday)
}