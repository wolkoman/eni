import {Calendar, CalendarEvents} from '../util/calendar-events';
import React, {useEffect} from 'react';
import {useCalendarStore, useUserStore} from '../util/store';
import {SectionHeader} from './SectionHeader';
import {CalendarInfo, getCalendarInfo} from '../util/calendar-info';
import {CalendarErrorNotice, Event, EventDescription, EventSummary, EventTime, getWeekDayName} from './Calendar';
import Link from 'next/link';
import {CalendarCacheNotice} from "./CalendarCacheNotice";

const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
type Person = keyof typeof personWords;

export function ComingUp({}) {
  const calendar = useCalendarStore(state => state);
  const [permissions, jwt, userLoaded, userLoad] = useUserStore(state => [state.permissions, state.jwt, state.loaded, state.load]);
  const infos = (["emmaus", "inzersdorf", "neustift"] as Calendar[]).map(name => getCalendarInfo(name));
  const now = new Date().getTime();
  const tomorrow = now + 3600 * 1000 * 24;
  const dates = [{label: "Heute", date: now}, {label: "Morgen", date: tomorrow}];

  useEffect(() => calendar.load(jwt), [jwt]);

  return <div data-testid="calendar" className="relative">
    <SectionHeader>Termine</SectionHeader>
    <div className="lg:-mx-16">

    <div className="hidden lg:grid grid-cols-3">
      {infos.map(info => <ComingUpTitle key={info.id} info={info}/>)}
      {dates.map((date, index) => <ComingUpRow label={date.label} now={date.date} infos={infos} calendar={calendar.items} last={index + 1 === dates.length}/>)}
    </div>

      <div className="lg:hidden">
        {infos.map(info =>
        <ComingUpColumn key={info.id} dates={dates} now={now} info={info} calendar={calendar.items}/>
        )}
      </div>

    <div className="text-right underline hover:no-underline cursor-pointer">
      <Link href="/termine"><a>Alle Termine anzeigen</a></Link>
    </div>
    </div>

    {calendar.error && <CalendarErrorNotice/>}
    <CalendarCacheNotice/>
  </div>;
}

function ComingUpColumn(props: { calendar: CalendarEvents, info: CalendarInfo, dates: ({ date: number; label: string } | { date: number; label: string })[], now: number }) {
  return <>
    <ComingUpTitle info={props.info}/>
    {props.dates.map(({label, date}, index) => <ComingUpCell
      key={index}
      label={label}
      now={date}
      info={props.info}
      calendar={props.calendar}
      last={index === props.dates.length - 1}
    />)}
  </>;
}

function ComingUpTitle(props: { info: CalendarInfo }) {
  return <div className="mx-2 overflow-hidden bg-white rounded-t-lg relative">
    <div className={props.info.className + " h-1"}/>
    <div className={`p-2 text-center text-xl font-bold relative z-10 `}>
      {props.info.shortName}
    </div>
    <div className={props.info.className + " absolute top-0 left-0 w-full h-full opacity-10"}/>
  </div>;
}

function ComingUpCell(props: { label: string; now: number; info: CalendarInfo; calendar: CalendarEvents; last?: boolean }) {
    const events = (props.calendar[new Date(props.now).toISOString().substring(0, 10)] ?? [])
      .filter(event => event.calendar === props.info.id && !event.tags.includes("cancelled"));
    return <div className={`mx-2 px-4 py-2 bg-white shadow-lg text-lg ${props.last && "rounded-b-lg mb-4"}`}>
      <div className={`opacity-80 uppercase mb-1 text-sm ${events.length === 0 && "hidden"}`}>
        {props.label}, {getWeekDayName(new Date(props.now).getDay())}
      </div>
        {events
          .map(event => <Event event={event} permissions={{}} noTag={true}/>)}
    </div>;
}

function ComingUpRow(props: { label: string, now: number, infos: CalendarInfo[], calendar: CalendarEvents, last?: boolean }) {
  return <>
    {props.infos.map(info => <ComingUpCell key={info.id} {...props} info={info}/>)}
  </>;
}
