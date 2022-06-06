import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {applyFilter, FilterType, LoadingEvents} from '../../components/calendar/Calendar';
import {useState} from '../../util/use-state-util';
import {CalendarCacheNotice} from '../../components/calendar/CalendarCacheNotice';
import {CalendarErrorNotice} from '../../components/calendar/CalendarErrorNotice';
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {FilterSelector} from '../../components/calendar/FilterSelector';
import {Event, EventDate} from '../../components/calendar/Event';
import {useRouter} from "next/router";
import Link from "next/link";
import {site} from "../../util/sites";

export default function EventPage() {
    const [filter, setFilter] = useState<FilterType>(null);
    const calendar = useCalendarStore(state => state);
    const [permissions, jwt, userLoad] = useUserStore(state => [state.user?.permissions ?? {}, state.jwt, state.load]);
    const {query: {q}} = useRouter();

    useEffect(() => userLoad(), []);
    useEffect(() => calendar.load(jwt), [jwt]);

    return <Site>
        <div data-testid="calendar" className="relative">
            <CalendarCacheNotice/>
            <div className="flex flex-col md:flex-row">
                {site(<div
                    className="flex flex-col w-full self-start p-2 md:p-4 md:mr-8 md:text-lg md:w-52 flex-shrink-0 bg-white rounded-xl border-4 border-black/10 sticky top-0 md:top-5 z-20 bg-white">
                    <FilterSelector
                        filter={filter}
                        setFilter={filter => setFilter(filter)}
                        userPermissions={permissions}
                    />
                </div>, <div className=" md:w-36"></div>)}
                <div className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
                    {q ? <div>
                            <div className="font-bold text-4xl mb-6">{q}</div>
                            <Link href="/termine">
                                <div className="cursor-pointer underline hover:no-underline">Alle Termine anzeigen</div>
                            </Link>
                        </div> :
                        <div className="font-bold text-4xl mb-6">Termine</div>}
                    {calendar.error && <CalendarErrorNotice/>}
                    {calendar.loading && <LoadingEvents/>}
                    {calendar.loading || Object.entries(calendar.groupByDate(applyFilter(calendar.items, filter, q as string)))
                        .map(([date, events]) => <div key={date} data-date={date}>
                            <EventDate date={new Date(date)}/>
                            {events.map(event => (<Event key={event.id} event={event} permissions={permissions}/>))}
                        </div>)}
                </div>
            </div>
        </div>
    </Site>;
}
