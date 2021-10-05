import {Calendar, CalendarEvent} from '../util/calendar-events';
import React, {useEffect, useState} from 'react';
import {Permission, useCalendarStore, useOverlayStore, useUserStore} from '../util/store';
import {SanitizeHTML} from './SanitizeHtml';
import {SectionHeader} from './SectionHeader';
import {getCalendarInfo} from "../util/calendar-info";

const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
type Person = keyof typeof personWords;


export function CalendarPage({}) {
  const [filter, setFilter] = useState<FilterType>(null);
  const calendar = useCalendarStore(state => state);
  const [permission, user, userLoaded, userLoad, userPermissions] = useUserStore(state => [state.permissions, state.user, state.loaded, state.load, state.permissions]);
  useEffect(() => userLoad(), []);
  useEffect(() => {
    if (userLoaded) {
      calendar.load(permission[Permission.PrivateCalendarAccess] ? user?.api_key : undefined);
    }
  }, [userLoaded]);

  let parishFilters: { label: string, parish?: Calendar }[] = [
    {label: 'Alle'},
    {label: 'Emmaus', parish: 'emmaus'},
    {label: 'St. Nikolaus', parish: 'inzersdorf'},
    {label: 'Neustift', parish: 'neustift'},
  ];
  return <div data-testid="calendar">
    <SectionHeader>Kalender</SectionHeader>
    {calendar.error && <CalendarErrorNotice/>}
    {calendar.error || <>
      <div className="flex flex-col md:flex-row bg-gray-100">
        <div className="flex flex-col p-2 md:p-4 md:mr-8 text-lg md:w-52 bg-gray-200 flex-shrink-0">
          {permission[Permission.PrivateCalendarAccess] && <PrivateCalendarNotice/>}
          <div
            className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
            data-testid="parish-selector">
            {parishFilters.map(filt => <div
              className={`px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer relative`} key={filt.label}
              onClick={() => setFilter(filt.parish ? {filterType: 'PARISH', parish: filt.parish} : null)}>
              {filt.label}
              {filt.parish &&
              <div
                className={`absolute bottom-0 left-0 h-0.5 transition-all ${getCalendarInfo(filt?.parish).className} ${filter?.filterType === 'PARISH' && filter.parish === filt.parish ? 'w-full opacity-100' : 'opacity-0 w-0'}`}/>}
            </div>)}
          </div>
          <div
            className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
            data-testid="person-selector">
            {[
              {label: 'Zvonko', action: () => setFilter({filterType: 'PERSON', person: 'brezovski'})},
              {label: 'David', action: () => setFilter({filterType: 'PERSON', person: 'campos'})},
              {label: 'Gil', action: () => setFilter({filterType: 'PERSON', person: 'thomas'})},
              {label: 'Marcin', action: () => setFilter({filterType: 'PERSON', person: 'wojciech'})},
            ].filter(filt => userPermissions[Permission.PrivateCalendarAccess]).map(filt => <div
              className="px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer" key={filt.label}
              onClick={filt.action}>{filt.label}</div>)}
          </div>
        </div>
        <div className="h-3xl overflow-y-auto flex-grow events py-4 px-4 lg:px-0">
          {calendar.loaded || <LoadingEvents/>}
          {Object.entries(calendar.items)
            ?.map(([date, events]) => [date, applyFilter(events, filter)] as [string, CalendarEvent[]])
            .filter(([_, events]) => events.length > 0)
            .map(([date, events]) => <div key={date}>
              <div className="mt-3 leading-5"><EventDate date={new Date(date)}/></div>
              {events.map(event => (<Event key={event.id} event={event} filter={filter}/>))}
            </div>)}
        </div>
      </div>
    </>}
  </div>;
}

function PrivateCalendarNotice() {
  return <div className="px-3 py-1 text-sm pb-4 text-gray-500">
    <div className="font-bold">Private Kalenderansicht</div>
    Geben Sie vertrauliche Daten nicht weiter!
  </div>;
}

function CalendarErrorNotice() {
  return <div className="bg-red-100 p-4 px-8">
    Beim Laden der Termine ist ein Fehler aufgetreten. <br/>
    Für Informationen zu den Terminen kontaktieren Sie die Kanzlei.
  </div>;
}

function ParishTag(props: { calendar: Calendar }) {
  const [displayOverlay, hideOverlay] = useOverlayStore(state => [state.display, state.hide]);
  return <div
    onMouseEnter={(e) => {
      return;
      const position = (e.target as HTMLDivElement).getBoundingClientRect();
      displayOverlay(<div className="bg-white rounded p-3" onMouseLeave={() => hideOverlay()}>
        <DumbParishTag calendar={props.calendar}/>
        <div>Pfarre Emmaus</div>
      </div>, {x: position.x - 10, y: position.y - 10});
    }}>
    <DumbParishTag calendar={props.calendar}/>
  </div>;
}
function DumbParishTag(props: { calendar: Calendar }) {
  return <div
    className={`w-14 text-xs leading-4 inline-block px-1 py-0.5 text-center rounded ${getCalendarInfo(props.calendar).className}`}>{{
    emmaus: 'Emmaus',
    inzersdorf: 'Nikolaus',
    neustift: 'Neustift',
  }[props.calendar as 'emmaus'|'inzersdorf'|'neustift']}</div>
}

export function Event({event, filter}: { event: CalendarEvent, filter: FilterType }) {
  return <div className="flex text-lg mb-1">
    <div className="w-10 flex-shrink-0 font-semibold">
      {event.start.dateTime && <EventTime date={new Date(event.start.dateTime)}/>}
    </div>
    <div className="mx-2"><ParishTag calendar={event.calendar}/></div>
    <div className="mb-2 leading-5" data-testid="event">
      <div className="mt-1 font-semibold"><EventSummary event={event}/></div>
      <div className="font-normal text-sm leading-4"><EventDescription event={event}/></div>
    </div>
  </div>;
}

export function EventSummary(props: {event: CalendarEvent}){
  const displaySummary = props.event.summary.split("/", 2)[0];
  return <>{props.event.visibility === 'private' && '🔒'} {displaySummary}</>;
}
export function EventDescription(props: {event: CalendarEvent}){
  const displayPersonen = props.event.summary.split("/", 2)?.[1];
  return <>
    {displayPersonen && <div>mit {displayPersonen}</div>}
    {props.event.description && <SanitizeHTML html={props.event.description?.replace(/\n/g, '<br/>')}/>}
  </>;
}

type FilterType = { filterType: 'PARISH', parish: Calendar } | { filterType: 'PERSON', person: Person } | null;

function applyFilter(events: CalendarEvent[], filter: FilterType) {
  return events
    .filter(event =>
      (filter?.filterType === 'PERSON' && personWords[filter.person].some(word => event.summary.match(word)))
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
const ShadowEventDate = () => <div className="w-32 h-3 mb-3 mt-6 shimmer"/>
const ShadowEvent = ({width, description}: { width: number, description: boolean }) => <div className="flex mb-3">
  <div className="w-10 h-4 shimmer mr-3"/>
  <div className="w-12 h-3 mt-0.5 shimmer mr-2 rounded-sm"/>
  <div>
    <div className="h-4 shimmer mr-2" style={{width}}/>
    <div className="h-2 shimmer mt-1" style={{width, display: description ? '':'none'}}/>
    <div className="h-2 shimmer mt-1" style={{width, display: description ? '':'none'}}/>
  </div>
</div>

export const EventDate = ({date}: { date: Date }) => {
  const day = date.getDay();
  return <span className={`${day ? '' : 'underline'}`}>
    {['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][day]},{' '}
    {date.getDate()}. {['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][date.getMonth()]}
  </span>;
}

export const EventTime = (props: { date: Date }) => {
  const hour = props.date.getHours();
  const minutes = props.date.getMinutes();
  return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}