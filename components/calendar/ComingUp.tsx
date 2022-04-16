import {getWeekDayName} from './Calendar';
import Link from 'next/link';
import {CalendarCacheNotice} from './CalendarCacheNotice';
import {CalendarErrorNotice} from './CalendarErrorNotice';
import {useEffect} from 'react';
import {CalendarInfo, getCalendarInfo} from '../../util/calendar-info';
import {Calendar, CalendarEvents} from '../../util/calendar-events';
import {useCalendarStore} from '../../util/use-calendar-store';
import {useUserStore} from '../../util/use-user-store';
import {Section} from '../Section';
import {Event} from './Event';

export function ComingUp({}) {
    const calendar = useCalendarStore(state => state);
    const [jwt] = useUserStore(state => [state.jwt]);
    const infos = (['emmaus', 'inzersdorf', 'neustift'] as Calendar[]).map(name => getCalendarInfo(name));
    const now = new Date().getTime();
    const tomorrow = now + 3600 * 1000 * 24;
    const dates = [{label: 'Heute', date: now}, {label: 'Morgen', date: tomorrow}];

    useEffect(() => calendar.load(jwt), [jwt]);

    return <Section title="Termine">
        {calendar.error ? <CalendarErrorNotice/> : <>
            <div className="lg:-mx-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {infos.map(info => <ComingUpColumn
                        key={info.id}
                        dates={dates}
                        info={info}
                        calendar={calendar.items}
                        loading={calendar.loading}
                    />
                )}
            </div>
            <div className="text-right underline hover:no-underline cursor-pointer mt-6">
                <Link href="/termine"><a>Alle Termine anzeigen</a></Link>
            </div>
            <CalendarCacheNotice/>
        </>
        }
    </Section>;
}

function ComingUpColumn(props: { calendar: CalendarEvents, info: CalendarInfo, dates: ({ date: number; label: string })[], loading: boolean }) {
    const eventCount = props.dates.reduce((events, date) => events + (props.calendar[getMyDate(date.date)]?.filter(event => event.calendar === props.info.id) ?? []).length, 0);
    return <div className="bg-white shadow text-lg rounded-lg overflow-hidden">
        <ComingUpTitle info={props.info}/>
        {(!props.loading && eventCount === 0) &&
          <div className="uppercase text-sm p-5">Keine Termine heute und morgen</div>}
        {props.loading && <div className="shimmer h-80"/>}
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
    return <div className={'relative ' + props.info.className}>
        <div className={`p-2 text-center text-xl font-bold relative z-10`}>
            {props.info.shortName}
        </div>
        <div className={'absolute top-0 left-0 w-full h-full'}/>
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