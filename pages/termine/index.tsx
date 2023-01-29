import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {applyFilter, FilterType, getMonthName, getWeekDayName} from '../../components/calendar/Calendar';
import {useState} from '../../util/use-state-util';
import {CalendarCacheNotice} from '../../components/calendar/CalendarCacheNotice';
import {CalendarErrorNotice} from '../../components/calendar/CalendarErrorNotice';
import {groupEventsByDate, useAuthenticatedCalendarStore} from '../../util/use-calendar-store';
import {useAuthenticatedUserStore} from '../../util/use-user-store';
import {FilterSelector} from '../../components/calendar/FilterSelector';
import {Event, EventDate} from '../../components/calendar/Event';
import {useRouter} from "next/router";
import Responsive from "../../components/Responsive";
import {CalendarEventWithSuggestion, CalendarGroup, CalendarTag, EventsObject} from "../../util/calendar-types";
import {CalendarName, getCalendarInfo} from "../../util/calendar-info";
import {getLiturgyDataTill, Liturgy, LiturgyData} from "../api/liturgy";
import {getCachedEvents, GetEventPermission} from "../../util/calendar-events";
import {Settings} from "../../components/Settings";
import {Preference, usePreference} from "../../util/use-preference";
import {compareLiturgy} from "../intern/reader/my";
import {EniLoading} from "../../components/Loading";
import {Permission} from "../../util/verify";
import {EventEdit, EventEditBackground} from "../../components/calendar/EventEdit";


function LiturgyInformation(props: { liturgies?: Liturgy[] }) {
    const [liturgyInformation] = usePreference(Preference.LiturgyInformation);

    return <div className="mb-3 text-sm relative z-10">
        {liturgyInformation && props.liturgies?.sort(compareLiturgy).map((liturgy) =>
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
    </div>;
}

function EventSearch(props: { onChange: (value: string) => any, filter: FilterType }) {
    return <input className="border border-black/50 px-3 py-1 rounded font-bold"
                  onChange={({target}) => props.onChange(target.value)} placeholder={props.filter ? {
        PERSON: `Suche mit ${props.filter?.filterType === "PERSON" && props.filter.person}`,
        GROUP: `Suche nach ${props.filter?.filterType === "GROUP" && props.filter.group}`,
        PARISH: `Suche in ${props.filter?.filterType === "PARISH" && getCalendarInfo(props.filter.parish).shortName}`
    }[props.filter.filterType] : "Suche"}/>;
}

function MonthView(props: { filter: FilterType, liturgy: LiturgyData, calendar: ReducedCalendarState }) {
    const [searchActive] = usePreference(Preference.Search);
    const [separateMass] = usePreference(Preference.SeparateMass);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(new Date());
    const getDays = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };
    const [year, month, day, daysInMonth] = [selected.getFullYear(), selected.getMonth(), (selected.getDay() + 1) % 7, getDays(selected.getFullYear(), selected.getMonth() + 1)];

    return <>
        <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
                <div className="p-3 bg-black/5 rounded-lg cursor-pointer"
                     onClick={() => setSelected(d => new Date(d.setMonth(month - 1)))}>⬅️
                </div>
                <div className="font-bold text-2xl w-44 text-center">{getMonthName(month)} {year}</div>
                <div className="p-3 bg-black/5 rounded-lg cursor-pointer"
                     onClick={() => setSelected(d => new Date(d.setMonth(month + 1)))}>➡️
                </div>
                {searchActive && <EventSearch onChange={setSearch} filter={props.filter}/>}
            </div>
            <div>
                <Settings/>
            </div>
        </div>
        {props.calendar.error && <CalendarErrorNotice/>}
        {props.calendar.loading && <EniLoading/>}
        <div className="grid grid-cols-7 gap-1">
            {Array.from({length: 7}).map((_, i) => <div>{getWeekDayName((i + 1) % 7)}</div>)}
            {Array.from({length: day}).map(() => <div></div>)}
            {Array.from({length: daysInMonth})
                .map((_, i) => ({
                    day: i + 1,
                    events: props.calendar.items
                        .filter(item => item.date === new Date(year, month, i + 2).toISOString().substring(0, 10))
                        .filter(event => !search || (event.summary + event.description).toLowerCase().includes(search.toLowerCase()))
                }))
                .map(({day, events}) => <div className="bg-black/5 p-1 rounded-lg">
                    <div className="text-right">{day}</div>
                    {events.map(event => <div className=" text-sm flex gap-1">
                        <div
                            className={getCalendarInfo(event.calendar).className + " mt-1.5 w-2 h-2 shrink-0 rounded-full"}></div>
                        <div className="line-clamp-1">{event.summary}</div>
                    </div>)}
                </div>)}
        </div>
    </>;
}

function AddEvent() {
    const [isEditing, setIsEditing] = useState(false);
    const {user} = useAuthenticatedUserStore();
    return user?.permissions[Permission.PrivateCalendarAccess] ? <>
        <div className={`p-3 rounded-lg bg-black/5 cursor-pointer static lg:relative`} onClick={() => setIsEditing(true)}>
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

function ListView(props: { filter: FilterType, liturgy: LiturgyData, calendar: ReducedCalendarState }) {
    const [searchActive] = usePreference(Preference.Search);
    const [separateMass] = usePreference(Preference.SeparateMass);
    const [search, setSearch] = useState("");
    return <>
        <div className="flex justify-between items-center mb-6">
            <div>
                <div className="font-bold text-4xl mb-6">Termine</div>
                {searchActive && <EventSearch onChange={setSearch} filter={props.filter}/>}
            </div>
            <div className="flex gap-2">
                <AddEvent/>
                <Settings/>
            </div>
        </div>
        {props.calendar.error && <CalendarErrorNotice/>}
        {props.calendar.loading && <EniLoading/>}
        {props.calendar.loading || Object.entries(groupEventsByDate(applyFilter(props.calendar.items
                .filter(event => !search || (event.summary + event.description + (event.tags.includes(CalendarTag.recurring) ? "" : "Einzelevent")).toLowerCase().includes(search.toLowerCase())),
            props.filter, separateMass)))
            .map(([date, events]) => <div key={date} data-date={date} className="py-2">
                <EventDate date={new Date(date)}/>
                <LiturgyInformation liturgies={props.liturgy[date]}/>
                {events.map(event => <Event key={event.id} event={event} enableEditing={true}/>)}
            </div>)}
    </>;
}

interface ReducedCalendarState {
    items: CalendarEventWithSuggestion[],
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
                <div className="flex flex-col md:flex-row">
                    {!monthView && <div
                        className="w-full self-start py-4 lg:px-2 md:mr-8 md:w-52 flex-shrink-0 sticky top-0 md:top-8 bg-gray-100 rounded-xl z-20">
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
                    </div>}
                    <div className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
                        {monthView
                            ? <MonthView calendar={calendar} liturgy={props.liturgy} filter={filter}/>
                            : <ListView calendar={calendar} liturgy={props.liturgy} filter={filter}/>
                        }
                    </div>
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