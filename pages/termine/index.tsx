import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {FilterType} from '../../components/calendar/Calendar';
import {useState} from '../../util/use-state-util';
import {CalendarCacheNotice} from '../../components/calendar/CalendarCacheNotice';
import {useAuthenticatedCalendarStore} from '../../util/use-calendar-store';
import {useAuthenticatedUserStore} from '../../util/use-user-store';
import {FilterSelector2} from '../../components/calendar/FilterSelector';
import {useRouter} from "next/router";
import Responsive from "../../components/Responsive";
import {CalendarEvent, CalendarGroup, CalendarTag, EventsObject} from "../../util/calendar-types";
import {CalendarName} from "../../util/calendar-info";
import {getLiturgyDataTill, LiturgyData} from "../api/liturgy";
import {getCachedEvents, GetEventPermission} from "../../util/calendar-events";
import {Preference, usePreference} from "../../util/use-preference";
import {Permission} from "../../util/verify";
import {EventEdit, EventEditBackground} from "../../components/calendar/EventEdit";
import {ListView2} from "../../components/calendar/ListView";
import {MonthView} from "../../components/calendar/MonthView";


export function AddEvent() {
    const [isEditing, setIsEditing] = useState(false);
    const {user} = useAuthenticatedUserStore();
    return user?.permissions[Permission.PrivateCalendarAccess] ? <>
        <div className={`p-3 rounded-lg bg-black/5 cursor-pointer static lg:relative`}
             onClick={() => setIsEditing(true)}>
            <div className="w-6 aspect-square">
                <svg viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.5 9V82" stroke="#484848" strokeWidth="18" strokeLinecap="round"/>
                    <path d="M82 45.5L9 45.5" stroke="#484848" strokeWidth="18" strokeLinecap="round"/>
                </svg>
            </div>
            {isEditing && <EventEdit onClose={() => setIsEditing(false)} parish={user!.parish}/>}
        </div>
        {isEditing && <EventEditBackground onClick={() => setIsEditing(false)}/>}
    </> : <></>;
}


export interface ReducedCalendarState {
    items: CalendarEvent[],
    error: boolean,
    loading: boolean,
    loaded: boolean
}

export default function EventPage(props: {
    liturgy: LiturgyData,
    eventsObject: EventsObject,
}) {
    const [filter, setFilter] = useState<FilterType>(null);
    const [firstFilterUpdate, setFirstFilterUpdate] = useState(true);
    const {user} = useAuthenticatedUserStore();
    const calendarStore = useAuthenticatedCalendarStore();
    const calendar = user
        ? calendarStore
        : {items: props.eventsObject.events, error: false, loading: false, loaded: true};
    const [separateMass] = usePreference(Preference.SeparateMass);
    const [monthView] = usePreference(Preference.MonthView);
    const {query: {q: groupQuery, p: parishQuery}, replace: routerReplace} = useRouter();

    const personOrdering = ["Pedro", "Kpl. David", "Kpl. Gil", "Pfv. Marcin", "Pfr. Dr. Brezovski"];

    useEffect(() => {
        if (groupQuery) setFilter({filterType: "GROUP", group: groupQuery as CalendarGroup})
        if (parishQuery) setFilter({filterType: "PARISH", parish: parishQuery as CalendarName})
    }, [groupQuery, parishQuery]);
    useEffect(() => {
        if (!firstFilterUpdate) {
            routerReplace({
                query: {
                    q: filter?.filterType !== "GROUP" ? null : filter.group,
                    p: filter?.filterType !== "PARISH" ? null : filter.parish
                }
            }).then()
        } else {
            setFirstFilterUpdate(false);
        }
    }, [filter]);

    return <Site responsive={false}>
        <Responsive sides={false}>
            <div data-testid="calendar" className="relative">
                <CalendarCacheNotice/>
                <div className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
                    {monthView
                        ? <MonthView calendar={calendar} liturgy={props.liturgy} filter={filter}/>
                        : <ListView2 calendar={calendar} liturgy={props.liturgy} filter={filter} filterSlot={
                            <FilterSelector2
                                filter={filter}
                                setFilter={filter => setFilter(filter)}
                                userPermissions={user?.permissions ?? {}}
                                groups={calendar.items
                                    .flatMap(event => event.groups)
                                    .filter((group, index, groups) => groups.indexOf(group) === index)
                                    .filter(group => separateMass || group !== CalendarGroup.Messe)
                                }
                                persons={[...new Set(calendar.items
                                    .filter(event => !event.tags.includes(CalendarTag.cancelled))
                                    .map(event => event.mainPerson)
                                    .filter((person): person is string => personOrdering.includes(person ?? ""))
                                )]
                                    .sort((a, b) => personOrdering.indexOf(b) - personOrdering.indexOf(a))
                                }
                            />
                        }/>
                    }
                </div>
            </div>
        </Responsive>
    </Site>;
}

export async function getStaticProps() {
    return {
        props: {
            liturgy: await getLiturgyDataTill(new Date(new Date().getTime() + 1000 * 3600 * 24 * 180)),
            eventsObject: await getCachedEvents({permission: GetEventPermission.PUBLIC}),
        },
        revalidate: 60,
    }
}