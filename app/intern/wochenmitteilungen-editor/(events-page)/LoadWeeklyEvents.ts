"use server"

import {loadEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";

export async function loadWeeklyEvents(minString: string, maxString: string) {
  const min = new Date(minString), max = new Date(new Date(maxString).getTime() + 24 * 3600 * 1000);
  const {events} = await loadEvents({
    access: EventLoadAccess.WEEKLY,
    timeFrame: {min, max}
  });
  return events.filter(event => !event.wholeday)
}