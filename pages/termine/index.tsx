import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {applyFilter, FilterType, LoadingEvents} from '../../components/calendar/Calendar';
import {useState} from '../../util/use-state-util';
import {CalendarCacheNotice} from '../../components/calendar/CalendarCacheNotice';
import {CalendarErrorNotice} from '../../components/calendar/CalendarErrorNotice';
import {groupEventsByDate, useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {FilterSelector} from '../../components/calendar/FilterSelector';
import {Event, EventDate} from '../../components/calendar/Event';
import {useRouter} from "next/router";
import Responsive from "../../components/Responsive";
import {CalendarGroup} from "../../util/calendar-types";
import {CalendarName} from "../../util/calendar-info";

export default function EventPage() {
    const [filter, setFilter] = useState<FilterType>(null);
    const [firstFilterUpdate, setFirstFilterUpdate] = useState(true);
    const calendar = useCalendarStore(state => state);
    const [permissions, jwt, userLoad] = useUserStore(state => [state.user?.permissions ?? {}, state.jwt, state.load]);
    const {query: {q: groupQuery, p: parishQuery}} = useRouter();
    const router = useRouter();

    useEffect(() => userLoad(), [userLoad]);
    useEffect(() => calendar.load(jwt), [jwt, calendar.load]);
    useEffect(() => {
        if(groupQuery) setFilter({filterType: "GROUP", group: groupQuery as CalendarGroup})
        if(parishQuery) setFilter({filterType: "PARISH", parish: parishQuery as CalendarName })
    }, [groupQuery, parishQuery]);
    useEffect(() => {
        if (!firstFilterUpdate) {
            router.push({query: {
                q: filter?.filterType !== "GROUP" ? null : filter.group,
                p: filter?.filterType !== "PARISH" ? null : filter.parish
            }}, "/termine")
        } else {
            setFirstFilterUpdate(false);
        }
    }, [filter]);

    return <Site responsive={false}>
        <Responsive sides={false}>
            <div data-testid="calendar" className="relative">
                <CalendarCacheNotice/>
                <div className="flex flex-col md:flex-row">
                    <div
                        className="w-full self-start py-4 lg:px-2 md:mr-8 md:w-52 flex-shrink-0 sticky top-0 md:top-8 z-20 bg-black/5 rounded-xl">
                        <FilterSelector
                            filter={filter}
                            setFilter={filter => setFilter(filter)}
                            userPermissions={permissions}
                            groups={calendar.items
                                .flatMap(event => event.groups)
                                .filter((group, index, groups) => groups.indexOf(group) === index)
                            }
                            persons={calendar.items
                                .map(event => event.mainPerson?.trim())
                                .filter((person): person is string => !!person && person.includes("."))
                                .filter((person, index, persons) => persons.indexOf(person) === index)
                            }
                        />
                    </div>
                    <div className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
                        {filter !== null ? <div>
                                <div className="font-bold text-4xl mb-6">{filter.filterType === "GROUP" ? filter.group : "Termine"}</div>
                                <div className="cursor-pointer underline hover:no-underline"
                                     onClick={() => setFilter(null)}>Alle Termine anzeigen
                                </div>
                            </div> :
                            <div className="font-bold text-4xl mb-6">Termine</div>}
                        {calendar.error && <CalendarErrorNotice/>}
                        {calendar.loading && <LoadingEvents/>}
                        {calendar.loading || Object.entries(groupEventsByDate(applyFilter(calendar.items, filter)))
                            .map(([date, events]) => <div key={date} data-date={date}>
                                <EventDate date={new Date(date)}/>
                                {events.map(event => (<Event key={event.id} event={event} permissions={permissions}/>))}
                            </div>)}
                    </div>
                </div>
            </div>
        </Responsive>
    </Site>;
}
