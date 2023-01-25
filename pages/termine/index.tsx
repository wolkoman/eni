import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {applyFilter, FilterType} from '../../components/calendar/Calendar';
import {useState} from '../../util/use-state-util';
import {CalendarCacheNotice} from '../../components/calendar/CalendarCacheNotice';
import {CalendarErrorNotice} from '../../components/calendar/CalendarErrorNotice';
import {groupEventsByDate, useAuthenticatedCalendarStore} from '../../util/use-calendar-store';
import {useAuthenticatedUserStore} from '../../util/use-user-store';
import {FilterSelector} from '../../components/calendar/FilterSelector';
import {Event, EventDate} from '../../components/calendar/Event';
import {useRouter} from "next/router";
import Responsive from "../../components/Responsive";
import {CalendarGroup, CalendarTag, EventsObject} from "../../util/calendar-types";
import {CalendarName} from "../../util/calendar-info";
import {getLiturgyData, LiturgyData} from "../api/liturgy";
import {getCachedEvents, GetEventPermission} from "../../util/calendar-events";
import {Settings} from "../../components/Settings";
import {Preference, usePreference} from "../../util/use-preference";
import {compareLiturgy} from "../intern/reader/my";
import {EniLoading} from "../../components/Loading";


export default function EventPage(props: {
    liturgy: LiturgyData,
    eventsObject: EventsObject,
}) {
    const [filter, setFilter] = useState<FilterType>(null);
    const [firstFilterUpdate, setFirstFilterUpdate] = useState(true);
    const calendarStore = useAuthenticatedCalendarStore();
    const {user} = useAuthenticatedUserStore();
    const calendar = user ? calendarStore : {items: props.eventsObject.events, error: false, loading: false};
    const {query: {q: groupQuery, p: parishQuery}} = useRouter();
    const router = useRouter();
    const [liturgyInformation] = usePreference(Preference.LiturgyInformation);
    const [separateMass] = usePreference(Preference.SeparateMass);
    const personOrdering = ["Pedro", "Kpl. David", "Kpl. Gil", "Pfv. Marcin", "Pfr. Dr. Brezovski"];

    useEffect(() => {
        if (groupQuery) setFilter({filterType: "GROUP", group: groupQuery as CalendarGroup})
        if (parishQuery) setFilter({filterType: "PARISH", parish: parishQuery as CalendarName})
    }, [groupQuery, parishQuery]);
    useEffect(() => {
        if (!firstFilterUpdate) {
            router.replace({
                query: {
                    q: filter?.filterType !== "GROUP" ? null : filter.group,
                    p: filter?.filterType !== "PARISH" ? null : filter.parish
                }
            })
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
                        className="w-full self-start py-4 lg:px-2 md:mr-8 md:w-52 flex-shrink-0 sticky top-0 md:top-8 z-50 bg-[#eee] rounded-xl">
                        <FilterSelector
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
                                .filter((person): person is string => !!person)
                            )]
                                .sort((a, b) => personOrdering.indexOf(b) - personOrdering.indexOf(a))
                            }
                        />
                    </div>
                    <div className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
                        <div className="flex justify-between items-center">
                            {filter !== null ? <div>
                                    <div
                                        className="font-bold text-4xl mb-6">{filter.filterType === "GROUP" ? filter.group : "Termine"}</div>
                                    <div className="cursor-pointer underline hover:no-underline"
                                         onClick={() => setFilter(null)}>Alle Termine anzeigen
                                    </div>
                                </div> :
                                <div className="font-bold text-4xl mb-6">Termine</div>
                            }
                            <Settings/>
                        </div>
                        {calendar.error && <CalendarErrorNotice/>}
                        {calendar.loading && <EniLoading/>}
                        {calendar.loading || Object.entries(groupEventsByDate(applyFilter(calendar.items, filter, separateMass)))
                            .map(([date, events]) => <div key={date} data-date={date} className="py-2">
                                <EventDate date={new Date(date)}/>
                                <div className="mb-3 text-sm relative z-10">
                                    {liturgyInformation && props.liturgy[date]?.sort(compareLiturgy).map((liturgy) =>
                                        <div className="-my-0.5 italic flex gap-2">
                                            <div className={`w-3 my-1 rounded ${{
                                                v: "bg-[#f0f]",
                                                w: "bg-[#ddd]",
                                                g: "bg-[#0c0]",
                                                r: "bg-[#f00]"
                                            }[liturgy.color]}`}/>
                                            <div>{liturgy.name} [{liturgy.rank}]</div>
                                        </div>
                                    )}
                                </div>
                                {events.map(event => <Event key={event.id} event={event}/>)}
                            </div>)}
                    </div>
                </div>
            </div>
        </Responsive>
    </Site>;
}

export async function getStaticProps() {
    return {
        props: {
            liturgy: await getLiturgyData(),
            eventsObject: await getCachedEvents({permission: GetEventPermission.PUBLIC}),
        },
        revalidate: 60,
    }
}