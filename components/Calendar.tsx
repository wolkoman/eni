import {Calendar as CalendarType, Calendar, CalendarEvent} from '../util/calendar-events';
import React, {useEffect, useState} from 'react';
import {Permission, useCalendarStore, useUserStore} from '../util/store';
import {SanitizeHTML} from './SanitizeHtml';

const personWords = {
  brezovski: ['Brezovski', 'Zvonko'],
  thomas: ['Thomas', 'Gil'],
  campos: ['David', 'Campos'],
  wojciech: ['Wojciech', 'Marcin']
}
type Person = keyof typeof personWords;


function PrivateCalendarNotice() {
  return <div className="text-center italic bg-gray-200 text-sm py-2">Private Kalenderansicht</div>;
}

function CalendarErrorNotice() {
  return <div className="bg-red-100 p-4 px-8">
    Beim Laden der Termine ist ein Fehler aufgetreten. <br/>
    Für Informationen zu den Terminen kontaktieren Sie die Kanzlei.
  </div>;
}

function Event({event, filter}: { event: CalendarEvent, filter: FilterType }) {

  const bgColor = (calendar: CalendarType) => ({
    'all': 'bg-white',
    'emmaus': 'bg-primary1',
    'inzersdorf': 'bg-primary2',
    'neustift': 'bg-primary3',
    'inzersdorf-organ': 'bg-primary3',
  })[calendar];

  const showCalendar = event.calendar !== 'all' && (filter === null || filter.filterType === 'PERSON');
  return <div className="flex text-lg font-semibold">
    <div className="w-10">{event.start.dateTime ?
      <EventTime date={new Date(event.start.dateTime)}/> : null}</div>
    <div>
      <div className={`${bgColor(event.calendar)} w-3 h-3 mx-3 rounded-xl mt-2`}/>
    </div>
    <div className="mb-2" data-testid="event">
      <div>{event.summary} {event.visibility === 'private' ? ' (privat)' : ''}</div>
      {showCalendar &&
        <div className="font-normal text-sm leading-4 italic">in {({
          emmaus: 'Emmaus',
          inzersdorf: 'St. Nikolaus',
          neustift: 'Neustift'
        } as any)[event.calendar]}</div>}
      <div className="font-normal text-sm leading-4">
        {event.description && <SanitizeHTML html={event.description?.replace(/\n/g, '<br/>')}/>}
      </div>
    </div>
  </div>;
}

type FilterType = { filterType: 'PARISH', parish: Calendar } | { filterType: 'PERSON', person: Person } | null;

function applyFilter(events: CalendarEvent[], filter: FilterType) {
  return events
     .filter(event =>
       (filter?.filterType === 'PERSON' && personWords[filter.person].some(word => event.summary.match(word)))
       || (filter?.filterType === 'PARISH' && event.calendar === filter.parish)
       || filter === null)

}

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

  return <div data-testid="calendar">
    {calendar.error && <CalendarErrorNotice/>}
    {calendar.error || <>
      {permission[Permission.PrivateCalendarAccess] && <PrivateCalendarNotice/>}
      <div className="flex flex-col md:flex-row bg-gray-100">
        <div className="flex flex-col p-2 lg:p-6 text-lg md:w-52 ">
          <div
            className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
            data-testid="parish-selector">
            {[
              {label: 'Alle', action: () => setFilter(null)},
              {label: 'Emmaus', action: () => setFilter({filterType: 'PARISH', parish: 'emmaus'})},
              {label: 'St. Nikolaus', action: () => setFilter({filterType: 'PARISH', parish: 'inzersdorf'})},
              {label: 'Neustift', action: () => setFilter({filterType: 'PARISH', parish: 'neustift'})},
            ].map(filt => <div
              className="px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer" key={filt.label}
              onClick={filt.action}>{filt.label}</div>)}
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

const LoadingEvents = () => <>
  <ShadowEventDate/>
  {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width}/>)}
  <ShadowEventDate/>
  {[180, 120].map((width, index) => <ShadowEvent key={index} width={width}/>)}
  <ShadowEventDate/>
  {[120, 100, 150].map((width, index) => <ShadowEvent key={index} width={width}/>)}
</>
const ShadowEventDate = () => <div className="w-32 h-4 bg-gray-200 mb-3 mt-6"/>
const ShadowEvent = ({width}: { width: number }) => <div className="flex items-center mb-3">
  <div className="w-11 h-5 bg-gray-200 mr-2"/>
  <div className="w-3 h-3 bg-gray-200 mr-2 rounded-3xl"/>
  <div className="h-5 bg-gray-200 mr-2" style={{width}}/>
</div>

export const EventDate = ({date}: { date: Date }) => {
  const day = date.getDay();
  return <div className={`${day ? '' : 'underline'}`}>
    {['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][day]},{' '}
    {date.getDate()}. {['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][date.getMonth()]}
  </div>;
}

export const EventTime = (props: { date: Date }) => {
  const hour = props.date.getHours();
  const minutes = props.date.getMinutes();
  return <>{('0' + hour).slice(-2)}:{('0' + minutes).slice(-2)}</>;
}