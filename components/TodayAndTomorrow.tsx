import {Event} from './calendar/Event';
import {SectionHeader} from "./SectionHeader";
import {groupEventsByDate} from "@/domain/events/CalendarGrouper";
import * as React from "react";
import Link from "next/link";
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {Links} from "@/app/(shared)/Links";

export async function TodayAndTomorrow() {
  const eventsObject = await loadCachedEvents({access: EventLoadAccess.PUBLIC})
  const today = new Date().toISOString().substring(0, 10);
  const tomorrow = new Date(new Date().getTime() + 3_600_000 * 24).toISOString().substring(0, 10);
  const eventsByDate = groupEventsByDate(eventsObject.events);

  const date = eventsByDate[today]?.some(event =>
      new Date(`${event.date} ${event.time}`) > new Date()
  ) ? today : tomorrow;
  const events = eventsByDate[date]

  if (events?.length === 0) return <></>;

  return <div id="termine">
    <SectionHeader>Termine</SectionHeader>
    <div className={`grid`}>
      <div className="overflow-hidden bg-white rounded-lg relative flex flex-col border border-black/10 shadow">
        <div className="text-xl font-semibold text-center mt-4 mb-4">
          {date === today ? "Heute" : "Morgen"}, {new Date(date).toLocaleDateString("de-AT", {weekday: "long"})}
        </div>
        <div className="px-3 pb-6">
          {events
              ? events.map(event => <Event key={event.id} event={event}/>)
              : <div className="text-center italic py-2 opacity-70">Heute keine Termine</div>
          }
        </div>
        <Link href={Links.Termine} className="p-1 text-center hover:bg-black/5 font-semibold border-t border-black/10">
          Alle Termine
        </Link>
      </div>
    </div>
  </div>;
}
