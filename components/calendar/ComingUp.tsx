import {Event, getWeekDayName} from './Calendar';
import Link from 'next/link';
import {CalendarCacheNotice} from './CalendarCacheNotice';
import {CalendarErrorNotice} from './CalendarErrorNotice';
import {useEffect} from 'react';
import {SectionHeader} from '../SectionHeader';
import {CalendarInfo, getCalendarInfo} from '../../util/calendar-info';
import {Calendar, CalendarEvents} from '../../util/calendar-events';
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';

export function ComingUp({}) {
    const calendar = useCalendarStore(state => state);
    const [jwt] = useUserStore(state => [state.jwt]);
    const infos = (['emmaus', 'inzersdorf', 'neustift'] as Calendar[]).map(name => getCalendarInfo(name));
    const now = new Date().getTime();
    const tomorrow = now + 3600 * 1000 * 24;
    const dates = [{label: 'Heute', date: now}, {label: 'Morgen', date: tomorrow}];

    useEffect(() => calendar.load(jwt), [jwt]);

    return <div data-testid="calendar" className="relative">
        <SectionHeader>Termine</SectionHeader>
        <div className="lg:-mx-16 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {!calendar.loaded
                ? Array(3).fill(0).map(info => <div className="shimmer h-44"/>)
                : infos.map(info => <ComingUpColumn
                    key={info.id}
                    dates={dates}
                    now={now}
                    info={info}
                    calendar={calendar.items}
                />
            )}
        </div>
        <div className="text-right underline hover:no-underline cursor-pointer mt-6">
            <Link href="/termine"><a>Alle Termine anzeigen</a></Link>
        </div>
        {calendar.error && <CalendarErrorNotice/>}
        <CalendarCacheNotice/>
    </div>;
}

function ComingUpColumn(props: { calendar: CalendarEvents, info: CalendarInfo, dates: ({ date: number; label: string })[], now: number }) {
    const eventCount = props.dates.reduce((events, date) => events + (props.calendar[getMyDate(date.date)]?.filter(event => event.calendar === props.info.id) ?? []).length, 0);
    return <div className="bg-white shadow-lg text-lg rounded-lg overflow-hidden">
        <ComingUpTitle info={props.info}/>
        {eventCount === 0 && <div className="uppercase text-sm p-5">Keine Termine heute und morgen</div>}
        {props.dates.map(({label, date}, index) => <ComingUpDate
            key={index}
            label={label}
            now={date}
            info={props.info}
            calendar={props.calendar}
            last={index === props.dates.length - 1}
        />)}
    </div>;
}

function ComingUpTitle(props: { info: CalendarInfo }) {
    return <div className="relative">
        <div className={props.info.className + ' h-1'}/>
        <div className={`p-2 text-center text-xl font-bold relative z-10 `}>
            {props.info.shortName}
        </div>
        <div className={props.info.className + ' absolute top-0 left-0 w-full h-full opacity-10'}/>
    </div>;
}

function getMyDate(props: number) {
    return new Date(props).toISOString().substring(0, 10);
}

function ComingUpDate(props: { label: string; now: number; info: CalendarInfo; calendar: CalendarEvents; last?: boolean }) {
    const events = (props.calendar[getMyDate(props.now)] ?? [])
        .filter(event => event.calendar === props.info.id && !event.tags.includes('cancelled'));
    return events.length === 0 ? <></> : <div className="m-4">
        <div className="opacity-80 uppercase mb-1 text-sm">
            {props.label}, {getWeekDayName(new Date(props.now).getDay())}
        </div>
        {events.map(event => <Event key={event.id} event={event} permissions={{}} noTag={true}/>)}
    </div>;
}