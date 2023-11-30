"use client"

import {Event} from './calendar/Event';
import {SectionHeader} from "./SectionHeader";
import {EventDateText} from "./calendar/EventUtils";
import {EventsObject} from "@/domain/events/EventMapper";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {groupEventsByDate} from "@/domain/events/CalendarGrouper";

export function TodayAndTomorrow(props: { eventsObject: EventsObject; }) {
  const today = new Date().toISOString().substring(0, 10);
  const tomorrow = new Date(new Date().getTime() + 3_600_000 * 24).toISOString().substring(0, 10);
  const eventsByDate = groupEventsByDate(props.eventsObject.events);
  const date = eventsByDate[today].some(event =>
      new Date(`${event.date} ${event.time}`) > new Date()
  ) ? today: tomorrow;
  const events = eventsByDate[date]

  if (events.length === 0) return <></>;

  const calendarEvents = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
      .map(c => (events ?? []).filter(e => e.calendar === c))
      .filter(events => events.length > 0);

  return <div className="">
    <SectionHeader id="termine">{date === today ? "Heute" : "Morgen"}</SectionHeader>
    <div className={`grid gap-4 pb-4 ${["", "md:grid-cols-2", "md:grid-cols-3"][calendarEvents.length - 1]}`}>
      {calendarEvents
        .map(events => {
          return <div className={`overflow-hidden rounded-2xl relative p-1 pb-6 flex flex-col border border-black/20`}>
                <div className="text-2xl font-semibold text-center mt-4 mb-4">
                  Pfarre {getCalendarInfo(events[0].calendar).shortName}
                </div>
                <div className="px-3">
                  <div className="my-2"><EventDateText date={new Date(date)}/></div>
                  {events.map(event => <Event key={event.id} event={event} small={true}/>)}
                </div>
              </div>;
            }
        )}
    </div>
  </div>;

}
