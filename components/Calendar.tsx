import {Calendar, CalendarEvent} from '../util/calendar-events';
import React, {useEffect, useRef} from 'react';
import {useCalendarStore, useUserStore} from '../util/store';
import {SanitizeHTML} from './SanitizeHtml';
import {SectionHeader} from './SectionHeader';
import {getCalendarInfo} from '../util/calendar-info';
import {Permission, Permissions} from '../util/verify';
import {useState} from '../util/use-state-util';
import {CalendarCacheNotice} from "./CalendarCacheNotice";

const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
type Person = keyof typeof personWords;

export function EventsPage({}) {
  const [datePositions, setDatePositions, setPartialDatePositions] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<FilterType>(null);
  const calendar = useCalendarStore(state => state);
  const [permissions, jwt, userLoaded, userLoad] = useUserStore(state => [state.permissions, state.jwt, state.loaded, state.load]);
  const calendarScrollerRef = useRef(null);
  const [position, setPosition] = useState('');

  useEffect(() => userLoad(), []);
  useEffect(() => calendar.load(jwt), [jwt]);

  return <div data-testid="calendar" className="relative">
    <CalendarCacheNotice/>
    {calendar.error && <CalendarErrorNotice/>}
    {calendar.error || <>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col w-full md:w-auto self-start p-2 md:p-4 md:mr-8 md:text-lg md:w-52 bg-white shadow flex-shrink-0 rounded-xl sticky top-2 md:top-10 z-20 bg-white">
          {permissions[Permission.PrivateCalendarAccess] && <PrivateCalendarNotice/>}
          <FilterSelector filter={filter} setFilter={filter => setFilter(filter)} userPermissions={permissions}/>
        </div>
        <div ref={calendarScrollerRef} className="flex-grow events mt-4 pb-4 px-4 lg:px-0 relative">
          {calendar.loading && <LoadingEvents/>}
          {calendar.loading || Object.entries(calendar.items)
            ?.map(([date, events]) => [date, applyFilter(events, filter)] as [string, CalendarEvent[]])
            .filter(([_, events]) => events.length > 0)
            .map(([date, events]) => <div key={date} data-date={date}>
              <EventDate date={new Date(date)} filter={filter} setOffsetTop={top => setPartialDatePositions({[date]: top})}/>
              {events.map(event => (<Event key={event.id} event={event} permissions={permissions}/>))}
            </div>)}
        </div>
      </div>
    </>}
  </div>;
}

function CalendarOverview(props: { date: string }) {
  const [data, , setPartialData] = useState({day: 0, month: 0, year: 2020, firstDay: 0, daysInMonth: 0});
  const changeMonth = (month: number) => {
    const date = new Date(data.year, data.month + month, data.day);
    setPartialData({year: date.getFullYear(), month: date.getMonth()});
  };

  useEffect(() => {
    setPartialData({
      firstDay: new Date(data.year, data.month, 1).getDay(),
      daysInMonth: new Date(data.year, data.month+1, 0).getDate(),
    });
  }, [data.month, data.year]);

  useEffect(() => {
    if(props.date === "" || props.date === undefined) return;
    const date = new Date(props.date);
    setPartialData({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
  }, [props.date]);

  return <>
    <div className="flex">
      <div onClick={() => changeMonth(-1)}>{"<"}</div>
      <div className="text-center flex-grow">{getMonthName(data.month)} {data.year}</div>
      <div onClick={() => changeMonth(1)}>{">"}</div>
    </div>
    <div className="grid grid-cols-7">
      {Array(((data.firstDay) +6)%7).fill(null).map((_, i) => <div key={i}/>)}
      {Array(data.daysInMonth).fill(null).map((_, i) => {
        return <div key={i} className={`text-sm text-center rounded-lg ${i+1 === data.day ? "bg-primary1 text-white" : ""}`}>{(i + 1)}</div>;
      })}
    </div>
  </>;
}

function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions}) {
  const parishFilters: {label: string, parish: Calendar}[] = [
    {label: 'Emmaus', parish: 'emmaus'},
    {label: 'St. Nikolaus', parish: 'inzersdorf'},
    {label: 'Neustift', parish: 'neustift'},
  ];
  const personFilters: {label: string, person: Person}[] = [
    {label: "Zvonko", person: 'brezovski'},
    {label: "David", person: 'campos'},
    {label: "Gil", person: 'thomas'},
    {label: "Marcin", person: 'wojciech'},
  ];
  return <>
    <div
      className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
      data-testid="parish-selector">
      <div
        className="px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer"
        onClick={() => props.setFilter(null)}>Alle</div>
      {parishFilters.map(filt => <div
          className="px-3 py-1 mb-1 cursor-pointer relative" key={filt.label}
          onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.parish})}>
          {filt.label}
          <div className={`absolute bottom-0 left-0 h-0.5 transition-all ${getCalendarInfo(filt?.parish).className} bg-gray-600 ${((props.filter?.filterType === 'PARISH' && props.filter.parish === filt.parish) || props.filter === null && filt.parish === 'all') ? 'w-full opacity-100' : 'opacity-0 w-0'}`}/>
        </div>
      )}
    </div>
    {props.userPermissions[Permission.PrivateCalendarAccess] && <div
      className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
      data-testid="parish-selector">
      {personFilters.map(filt => <div
          className="px-3 py-1 mb-1 cursor-pointer relative" key={filt.label}
          onClick={() => props.setFilter({filterType: 'PERSON', person: filt.person})}>
          {filt.label}
        </div>
      )}
    </div>}
  </>;
}

export function PrivateCalendarNotice() {
  return <div className="px-3 py-1 text-sm pb-4 text-gray-500 md:w-44">
    <div className="font-bold">Private Kalenderansicht</div>
    Geben Sie vertrauliche Daten nicht weiter!
  </div>;
}

export function CalendarErrorNotice() {
  return <div className="bg-gray-100 p-4 px-8 rounded" data-testid="calendar-error">
    Beim Laden der Termine ist ein Fehler aufgetreten. <br/>
    Für Informationen zu den Terminen kontaktieren Sie die Kanzlei.
  </div>;
}

export function ParishTag(props: { calendar: Calendar, colorless?: boolean }) {
  const info = getCalendarInfo(props.calendar);
  return <div className={`w-14 text-xs leading-4 inline-block px-1 py-0.5 text-center rounded cursor-default ${props.colorless || info.className}`}>{info.tagName}</div>
}

export function Event({event, permissions, noTag}: { event: CalendarEvent, permissions: Permissions, noTag?: boolean }) {
  return <div className={`flex text-lg mb-1 ${event.tags.includes("cancelled") && 'opacity-50'}`}>
    <div className={`w-10 flex-shrink-0 mr-2 ${event.tags.includes("cancelled") || 'font-semibold'}`}>
      {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
    </div>
    {noTag || <div className="mr-2"><ParishTag calendar={event.calendar} colorless={event.tags.includes("cancelled")}/></div>}
    <div className="mb-2 leading-5" data-testid="event">
      <div className={`mt-1 ${event.tags.includes("cancelled") || 'font-semibold'}`}><EventSummary event={event}/></div>
      <div><EventDescription event={event} permissions={permissions}/></div>
    </div>
  </div>;
}

export function EventSummary(props: {event: CalendarEvent}){
  return <>{props.event.summary}</>;
}
export function EventDescription(props: {event: CalendarEvent, permissions: Permissions}){
  return <div className="font-normal text-sm leading-4">
    {props.permissions[Permission.PrivateCalendarAccess] && <>
    {props.event.tags.includes('private') && <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🔒 Vertraulich</div>}
    {props.event.tags.includes('in-church') && props.event.calendar === 'inzersdorf' && <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🎹 Orgel-Blocker</div>}
    </>}
    {!props.event.tags.includes("cancelled") && <>
      {props.event.mainPerson && `mit ${props.event.mainPerson}`}
      {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}</>}
  </div>;
}

type FilterType = { filterType: 'PARISH', parish: Calendar } | { filterType: 'PERSON', person: Person } | null;

function applyFilter(events: CalendarEvent[], filter: FilterType) {
  return events
    .filter(event =>
      (filter?.filterType === 'PERSON' && personWords[filter.person].some(word => event.mainPerson?.match(word)))
      || (filter?.filterType === 'PARISH' && event.calendar === filter.parish)
      || filter === null)

}

const LoadingEvents = () => <>
  <ShadowEventDate/>
  {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width} description={index===0}/>)}
  <ShadowEventDate/>
  {[180, 120].map((width, index) => <ShadowEvent key={index} width={width} description={index===2}/>)}
  <ShadowEventDate/>
  {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width} description={index===1}/>)}
</>
const ShadowEventDate = () => <div className="w-36 h-4 mb-1.5 mt-4 shimmer"/>
const ShadowEvent = ({width, description}: { width: number, description: boolean }) => <div className="flex mb-3">
  <div className="w-10 h-5 shimmer mr-2"/>
  <div className="w-14 h-5 shimmer mr-2"/>
  <div>
    <div className="h-5 shimmer mr-2" style={{width}}/>
    <div className="h-3 shimmer mt-0.5" style={{width, display: description ? '':'none'}}/>
    <div className="h-3 shimmer mt-0.5" style={{width: width / 2, display: description ? '':'none'}}/>
  </div>
</div>

export function getWeekDayName(day: number) {
  return ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][day];
}
export function getMonthName(month: number) {
  return ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][month];
}

export const EventDate = ({date, setOffsetTop, filter}: { filter?: any, date: Date, setOffsetTop?: (top: number) => void }) => {
  const ref = useRef(null);
  useEffect(() => {
    console.log('set top');
    if (setOffsetTop)
      setOffsetTop((ref.current as unknown as HTMLElement).offsetTop!);
  }, [ref, filter]);
  const day = date.getDay();
  return <div className="sticky top-14 md:top-0 relative z-10">
    <div className={`mp-3 leading-5 bg-gray-back pt-4 ${day ? '' : 'underline'}`} ref={ref}>
      {getWeekDayName(day)},{' '}
      {date.getDate()}. {getMonthName(date.getMonth())}
    </div>
    <div className="h-4 to-gray-50 bg-gradient-to-t from-transparent"/>
  </div>;
}

export const EventTime = (props: { date: Date }) => {
  const hour = props.date.getHours();
  const minutes = props.date.getMinutes();
  return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}