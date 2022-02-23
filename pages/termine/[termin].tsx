import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {useState} from "../../util/use-state-util";
import {useRouter} from "next/router";
import {CalendarEvent} from "../../util/calendar-events";
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {EventDateText, EventDescription, EventTime} from '../../components/calendar/Event';

export default function EventPage() {
  const calendar = useCalendarStore(state => state);
  const [permissions, jwt, userLoad] = useUserStore(state => [state.user?.permissions ?? {}, state.jwt, state.load]);
  const [event, setEvent] = useState<CalendarEvent | undefined | null>(undefined);
  const {query: {termin}} = useRouter();

  useEffect(() => userLoad(), []);
  useEffect(() => calendar.load(jwt), [jwt]);
  useEffect(() => {
    if (Object.keys(calendar.items).length === 0) return;
    const events = Object.values(calendar.items).flat();
    setEvent(events.find(item => item.id === termin) ?? null);
  }, [calendar.items]);

  return <Site>
    {event === undefined && <>lädt</>}
    {event === null && <>nicht gefunden</>}
    {event && <>
      {JSON.stringify(event)}
      <div className="text-2xl my-1"><EventDateText date={new Date(event?.date)}/>, <EventTime
        date={new Date(event?.start.dateTime)}/> Uhr
      </div>
      <div className="text-4xl my-2">{event?.summary}</div>
      <div className="text-4xl my-2"><EventDescription event={event} permissions={permissions}/></div>
    </>}
  </Site>
}
