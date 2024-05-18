import {Event} from './calendar/Event';
import {SectionHeader} from "./SectionHeader";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {groupEventsByDate} from "@/domain/events/CalendarGrouper";
import {site} from "@/app/(shared)/Instance";
import * as React from "react";
import Button from "./Button";
import Link from "next/link";
import {loadCachedEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";

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
    <SectionHeader>{date === today ? "Heute" : "Morgen"}</SectionHeader>
    <div className={`grid gap-4 pb-4 ${site('md:grid-cols-3', '')}`}>
      {site([CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT], [CalendarName.EMMAUS])
        .map(c => {
          const calendarEvents = (events ?? []).filter(e => e.calendar === c)
          return <div key={c} className={`overflow-hidden bg-white rounded-lg relative p-1 pb-6 flex flex-col border border-black/10 shadow`}>
            <div className="text-xl font-semibold text-center mt-4 mb-4">
              Pfarre {getCalendarInfo(c).shortName}
            </div>
            <div className="px-3">
              {calendarEvents.length > 0
                ? calendarEvents.map(event => <Event key={event.id} event={event} small={true}/>)
                : <div className="text-center italic py-2 opacity-70">Heute keine Termine</div>
              }
            </div>
          </div>;
        })}
      {site(<></>, <div className="flex justify-end">
        <Link href="//eni.wien/termine?p=emmaus"><Button label="Alle Termine"/></Link>
      </div>)}
    </div>
  </div>;
}
