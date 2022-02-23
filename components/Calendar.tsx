import {CalendarEvent} from '../util/calendar-events';
import React, {useEffect, useRef} from 'react';
import {Permission} from '../util/verify';
import {useState} from '../util/use-state-util';
import {CalendarErrorNotice, PrivateCalendarNotice} from './CalendarNotice';
import {applyFilter, FilterSelector, FilterType} from './CalendarFilter';
import {Event, EventDate} from './CalendarEvent';
import {useCalendarStore} from '../util/use-calendar-store';
import {useUserStore} from '../util/use-user-store';

export function EventsPage({}) {
    const [filter, setFilter] = useState<FilterType>(null);
    const calendar = useCalendarStore(state => state);
    const [permissions, jwt, userLoaded, userLoad] = useUserStore(state => [state.user?.permissions ?? {}, state.jwt, state.loaded, state.load]);
    const calendarScrollerRef = useRef(null);

    useEffect(() => userLoad(), []);
    useEffect(() => calendar.load(jwt), [jwt]);

    return <div data-testid="calendar" className="relative">
        {calendar.error && <CalendarErrorNotice/>}
        {calendar.error || <>
          <div className="flex flex-col md:flex-row">
            <div
              className="flex flex-col w-full md:w-auto self-start p-2 md:p-4 md:mr-8 md:text-lg md:w-52 bg-white shadow flex-shrink-0 rounded-xl sticky top-2 md:top-10 z-20 bg-white">
                {permissions[Permission.PrivateCalendarAccess] && <PrivateCalendarNotice/>}
              <FilterSelector filter={filter} setFilter={filter => setFilter(filter)} userPermissions={permissions}/>
            </div>
            <div ref={calendarScrollerRef} className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
                {calendar.loading && <LoadingEvents/>}
                {calendar.loading || Object.entries(calendar.items)
                    ?.map(([date, events]) => [date, applyFilter(events, filter)] as [string, CalendarEvent[]])
                    .filter(([_, events]) => events.length > 0)
                    .map(([date, events]) => <div key={date} data-date={date}>
                        <EventDate date={new Date(date)} filter={filter} setOffsetTop={top => {}}/>
                        {events.map(event => (<Event key={event.id} event={event} permissions={permissions}/>))}
                    </div>)}
            </div>
          </div>
        </>}
    </div>;
}

const LoadingEvents = () => <>
    <ShadowEventDate/>
    {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width} description={index === 0}/>)}
    <ShadowEventDate/>
    {[180, 120].map((width, index) => <ShadowEvent key={index} width={width} description={index === 2}/>)}
    <ShadowEventDate/>
    {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width} description={index === 1}/>)}
</>
const ShadowEventDate = () => <div className="w-36 h-4 mb-1.5 mt-4 shimmer"/>
const ShadowEvent = ({width, description}: { width: number, description: boolean }) => <div className="flex mb-3">
    <div className="w-10 h-5 shimmer mr-2"/>
    <div className="w-14 h-5 shimmer mr-2"/>
    <div>
        <div className="h-5 shimmer mr-2" style={{width}}/>
        <div className="h-3 shimmer mt-0.5" style={{width, display: description ? '' : 'none'}}/>
        <div className="h-3 shimmer mt-0.5" style={{width: width / 2, display: description ? '' : 'none'}}/>
    </div>
</div>

export function getWeekDayName(day: number) {
    return ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][day];
}

export function getMonthName(month: number) {
    return ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][month];
}

