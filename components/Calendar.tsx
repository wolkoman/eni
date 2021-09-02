import {Calendar as CalendarType, CalendarEvent} from '../util/calendarEvents';
import React, {useEffect, useState} from 'react';
import {Permission, useCalendarStore, useUserStore} from '../util/store';
import {SanitizeHTML} from './SanitizeHtml';


export function Calendar({}) {
  const [filter, setFilter] = useState<CalendarType | null>(null);
  const [calendar, calendarLoaded, calendarLoad] = useCalendarStore(state => [state.items, state.loaded, state.load]);
  const [permission, user, userLoaded, userLoad] = useUserStore(state => [state.permissions, state.user, state.loaded, state.load]);
  useEffect(() => userLoad(), []);
  useEffect(() => {
    if (userLoaded) {
      calendarLoad(permission[Permission.PrivateCalendarAccess] ? user?.api_key : undefined);
    }
  }, [userLoaded]);

  const bgColor = (calendar: CalendarType) => ({
    'all': 'bg-white',
    'emmaus': 'bg-primary1',
    'inzersdorf': 'bg-primary2',
    'neustift': 'bg-primary3'
  })[calendar];

  return <div>
    {permission[Permission.PrivateCalendarAccess] ? <div className="text-center italic bg-gray-200 text-sm">Private Kalenderansicht</div> : null}
    <div className="flex flex-col md:flex-row bg-gray-100">
      <div className="flex md:flex-col flex-row p-2 lg:p-6 text-lg md:w-52 justify-around md:justify-start flex-shrink-0">
        {[
          {label: 'Alle', action: () => setFilter(null)},
          {label: 'Emmaus', action: () => setFilter('emmaus')},
          {label: 'St. Nikolaus', action: () => setFilter('inzersdorf')},
          {label: 'Neustift', action: () => setFilter('neustift')},
        ].map(parish => <div className="px-3 py-1 hover:bg-gray-200 mb-1 cursor-pointer" key={parish.label}
                             onClick={parish.action}>{parish.label}</div>)}
      </div>
      <div className="h-3xl overflow-y-auto flex-grow events py-4 px-4 lg:px-0">
        {calendarLoaded || <LoadingEvents/>}
        {Object.entries(calendar)
          ?.map(([date, events]) => [date, events.filter(event => event.calendar === filter || filter === null)] as [string, CalendarEvent[]])
          .filter(([_, events]) => events.length > 0)
          .map(([date, events]) => <div key={date}>
            <div className="mt-3 leading-5"><EventDate date={new Date(date)}/></div>
            {events.map(event => <div className="flex text-lg font-semibold" key={event.id}>
              <div className="w-10">{event.start.dateTime ? <EventTime date={new Date(event.start.dateTime)}/> : null}</div>
              <div>
                <div className={`${bgColor(event.calendar)} w-3 h-3 mx-3 rounded-xl mt-2`}/>
              </div>
              <div className="mb-2">
                <div>{event.summary} {event.visibility === 'private' ? ' (privat)' : ''}</div>
                {event.calendar !== 'all' && filter === null ?
                  <div className="font-normal text-sm leading-4 italic">in {({
                    emmaus: 'Emmaus',
                    inzersdorf: 'St. Nikolaus',
                    neustift: 'Neustift'
                  } as any)[event.calendar]}</div> : null}
                <div className="font-normal text-sm leading-4">
                  {event.description
                    ? <SanitizeHTML html={event.description?.replace(/\n/g, '<br/>')}/>
                    : null}
                </div>
              </div>
            </div>)}
          </div>)}
      </div>
    </div>
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
const ShadowEventDate = () => <div className="w-32 h-4 bg-black opacity-20 mb-3 mt-6"/>
const ShadowEvent = ({width}: { width: number }) => <div className="flex items-center mb-3">
  <div className="w-11 h-5 bg-black opacity-30 mr-2"/>
  <div className="w-3 h-3 bg-black opacity-30 mr-2 rounded-3xl"/>
  <div className="h-5 bg-black opacity-30 mr-2" style={{width}}/>
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
  return <>{('0'+hour).slice(-2)}:{('0'+minutes).slice(-2)}</>;
}