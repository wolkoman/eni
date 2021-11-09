import {Calendar, CalendarEvent} from '../util/calendar-events';
import React, {useEffect, useRef} from 'react';
import {useCalendarStore, useUserStore} from '../util/store';
import {SanitizeHTML} from './SanitizeHtml';
import {SectionHeader} from './SectionHeader';
import {getCalendarInfo} from '../util/calendar-info';
import {Permission, Permissions} from '../util/verify';
import {useState} from '../util/use-state-util';

const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
type Person = keyof typeof personWords;


export function CalendarPage({}) {
  const [datePositions, setDatePositions, setPartialDatePositions] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<FilterType>(null);
  const calendar = useCalendarStore(state => state);
  const [permissions, jwt, userLoaded, userLoad] = useUserStore(state => [state.permissions, state.jwt, state.loaded, state.load]);

  useEffect(() => userLoad(), []);
  useEffect(() => calendar.load(jwt), [jwt]);

  const calendarScrollerRef = useRef(null);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const calendar = calendarScrollerRef.current as unknown as HTMLElement;
    const handler = (e: Event) => {
      requestIdleCallback(() => {
        console.log("handle", new Date().getTime());
        setPos((e)!.target!.scrollTop!);
      });
    };
    //calendar.addEventListener("scroll", handler);

    return () => calendar.removeEventListener("scroll", handler);
  }, [calendarScrollerRef]);

  return <div data-testid="calendar" className="relative">
    <SectionHeader>Kalender</SectionHeader>
    {calendar.error && <CalendarErrorNotice/>}
    {calendar.error || <>
      <div className="flex flex-col md:flex-row bg-gray-100 rounded-xl overflow-hidden">
        <div className="flex flex-col p-2 md:p-4 md:mr-8 text-lg md:w-52 bg-gray-200 flex-shrink-0 rounded-xl">
          {permissions[Permission.PrivateCalendarAccess] && <PrivateCalendarNotice/>}
          <FilterSelector filter={filter} setFilter={filter => setFilter(filter)} userPermissions={permissions}/>
        </div>
        <div className="h-3xl overflow-y-auto flex-grow events py-4 px-4 lg:px-0 relative" ref={calendarScrollerRef}>
          {calendar.loading && <LoadingEvents/>}
          {calendar.loading || Object.entries(calendar.items)
            ?.map(([date, events]) => [date, applyFilter(events, filter)] as [string, CalendarEvent[]])
            .filter(([_, events]) => events.length > 0)
            .map(([date, events]) => <div key={date} data-date={date}>
              <div className="mt-3 leading-5">
                <EventDate date={new Date(date)} filter={filter} setOffsetTop={top => setPartialDatePositions({[date]: top})}/>
              </div>
              {events.map(event => (<Event key={event.id} event={event} permissions={permissions}/>))}
            </div>)}
        </div>
      </div>
    </>}
  </div>;
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
          className="px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer relative" key={filt.label}
          onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.parish})}>
          {filt.label}
          <div className={`absolute bottom-0 left-0 h-0.5 transition-all s${getCalendarInfo(filt?.parish).className}s bg-gray-600 ${((props.filter?.filterType === 'PARISH' && props.filter.parish === filt.parish) || props.filter === null && filt.parish === 'all') ? 'w-full opacity-100' : 'opacity-0 w-0'}`}/>
        </div>
      )}
    </div>
    {props.userPermissions[Permission.PrivateCalendarAccess] && <div
      className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
      data-testid="parish-selector">
      {personFilters.map(filt => <div
          className="px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer relative" key={filt.label}
          onClick={() => props.setFilter({filterType: 'PERSON', person: filt.person})}>
          {filt.label}
        </div>
      )}
    </div>}
  </>;
}

function PrivateCalendarNotice() {
  return <div className="px-3 py-1 text-sm pb-4 text-gray-500">
    <div className="font-bold">Private Kalenderansicht</div>
    Geben Sie vertrauliche Daten nicht weiter!
  </div>;
}

function CalendarErrorNotice() {
  return <div className="bg-gray-100 p-4 px-8 rounded" data-testid="calendar-error">
    Beim Laden der Termine ist ein Fehler aufgetreten. <br/>
    Für Informationen zu den Terminen kontaktieren Sie die Kanzlei.
  </div>;
}

function ParishTag(props: { calendar: Calendar }) {
  return <DumbParishTag calendar={props.calendar}/>;
}
function DumbParishTag(props: { calendar: Calendar }) {
  const info = getCalendarInfo(props.calendar);
  return <div className={`w-14 text-xs leading-4 inline-block px-1 py-0.5 text-center rounded cursor-default ${info.className}`}>{info.tagName}</div>
}

export function Event({event, permissions}: { event: CalendarEvent, permissions: Permissions }) {
  return <div className="flex text-lg mb-1">
    <div className="w-10 flex-shrink-0 font-semibold">
      {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
    </div>
    <div className="mx-2"><ParishTag calendar={event.calendar}/></div>
    <div className="mb-2 leading-5" data-testid="event">
      <div className="mt-1 font-semibold"><EventSummary event={event}/></div>
      <div className="font-normal text-sm leading-4"><EventDescription event={event} permissions={permissions}/></div>
    </div>
  </div>;
}

export function EventSummary(props: {event: CalendarEvent}){
  return <>{props.event.summary}</>;
}
export function EventDescription(props: {event: CalendarEvent, permissions: Permissions}){
  return <>
    {props.permissions[Permission.PrivateCalendarAccess] && <>
    {props.event.tags.includes('private') && <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🔒 Vertraulich</div>}
    {props.event.tags.includes('in-church') && props.event.calendar === 'inzersdorf' && <div className="text-xs p-0.5 m-1 bg-gray-300 inline-block rounded">🎹 Orgel-Blocker</div>}
    </>}
    {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}
  </>;
}

type FilterType = { filterType: 'PARISH', parish: Calendar } | { filterType: 'PERSON', person: Person } | null;

function applyFilter(events: CalendarEvent[], filter: FilterType) {
  return events
    .filter(event =>
      (filter?.filterType === 'PERSON' && personWords[filter.person].some(word => event.description?.match(word)))
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

export const EventDate = ({date, setOffsetTop, filter}: { filter: any, date: Date, setOffsetTop?: (top: number) => void }) => {

  const ref = useRef(null);
  useEffect(() => {
    if(setOffsetTop)
    setOffsetTop((ref.current as unknown as HTMLElement).offsetTop!);
  }, [ref, filter]);
  const day = date.getDay();
  return <span className={`${day ? '' : 'underline'}`} ref={ref}>
    {getWeekDayName(day)},{' '}
    {date.getDate()}. {['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][date.getMonth()]}
  </span>;
}

export const EventTime = (props: { date: Date }) => {
  const hour = props.date.getHours();
  const minutes = props.date.getMinutes();
  return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}