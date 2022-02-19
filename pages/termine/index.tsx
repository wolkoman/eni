import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {
    applyFilter,
    FilterType,
    LoadingEvents
} from '../../components/calendar/Calendar';
import {useState} from '../../util/use-state-util';
import {CalendarCacheNotice} from '../../components/calendar/CalendarCacheNotice';
import {CalendarErrorNotice} from '../../components/calendar/CalendarErrorNotice';
import {Permission} from '../../util/verify';
import {CalendarPrivateNotice} from '../../components/calendar/CalendarPrivateNotice';
import {CalendarEvent} from '../../util/calendar-events';
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {FilterSelector} from '../../components/calendar/FilterSelector';
import {Event, EventDate} from '../../components/calendar/Event';
import {Section} from '../../components/Section';

export default function EventPage() {
    const [filter, setFilter] = useState<FilterType>(null);
    const calendar = useCalendarStore(state => state);
    const [permissions, jwt, userLoad] = useUserStore(state => [state.permissions, state.jwt, state.load]);

    useEffect(() => userLoad(), []);
    useEffect(() => calendar.load(jwt), [jwt]);

    return <Site>
        <div data-testid="calendar" className="relative">
            <CalendarCacheNotice/>
            {calendar.error || <>
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col w-full md:w-auto self-start p-2 md:p-4 md:mr-8 md:text-lg md:w-52 bg-white shadow flex-shrink-0 rounded-xl sticky top-0 md:top-5 z-20 bg-white">
                  <FilterSelector
                    filter={filter}
                    setFilter={filter => setFilter(filter)}
                    userPermissions={permissions}
                  />
                </div>
                <div className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
                    <div className="font-bold text-4xl mb-6">Termine</div>
                    {calendar.error && <CalendarErrorNotice/>}
                    {calendar.loading && <LoadingEvents/>}
                    {calendar.loading || Object.entries(calendar.items)
                        ?.map(([date, events]) => [date, applyFilter(events, filter)] as [string, CalendarEvent[]])
                        .filter(([_, events]) => events.length > 0)
                        .map(([date, events]) => <div key={date} data-date={date}>
                            <EventDate date={new Date(date)}/>
                            {events.map(event => (<Event key={event.id} event={event} permissions={permissions}/>))}
                        </div>)}
                </div>
              </div>
            </>}
        </div>
    </Site>;
}
